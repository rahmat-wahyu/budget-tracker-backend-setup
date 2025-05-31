const { Op, where } = require('sequelize');
const { Transaction, User, Category } = require('../../../models');
const { includes } = require('zod/v4');
const NotFound = require('../../errors/NotFoundError');
const BadRequestError = require('../../errors/BadRequestError');

class TransactionService {
    async getAllByUser(userId, page = 1, limit = 10, search = "") {
        const offset = (page - 1) * limit;
        const whereClause = {
            user_id: userId
        }

        if(search){
            whereClause[Op.or] = [
                {note: { [Op.like]: `%${search}%`}},
                {desc: { [Op.like]: `%${search}%`}},
            ]
        }

        const { count, rows } = await Transaction.findAndCountAll({
            where: whereClause,
            include: [
                {
                    model: Category,
                    attributes: ["name", "description"],
                    as: "category",
                    require: false
                },
                {
                    model: User,
                    attributes: ["id", "name", "email", "number"],
                    as: "user",
                    require: false
                }
            ],
            order: [["date", "DESC"]],
            limit,
            offset,
            distinct: true,
        })

        return {
            data: rows,
            pagination: {
                total: count,
                page,
                limit,
                totalPage: Math.ceil(count / limit)
            }
        }
    }

    async getById(id){
        const transaction = await Transaction.findOne({
            where: {id},
            include: [
                {
                    model: Category,
                    attributes: ["name", "description"],
                    as: "category",
                    require: false
                },
                {
                    model: User,
                    attributes: ["id", "name", "email", "number"],
                    as: "user",
                    require: false
                }
            ],
        });

        if(!transaction) throw new NotFound("Data Transaksi tidak ditemukan!")
        return transaction
    }

    async create(data) {
        const transaction = await Transaction.findByPk(id);
        if(!transaction) throw new NotFound("Transaksi Tidak ditemukan");
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        const transactions = await Transaction.findAll({
            where: {
                user_id: data.user_id,
                date: {
                    [Op.between]: [startOfMonth, endOfMonth]
                }
            }
        });

        let totalIncome = 0;
        let totalExpense = 0;

        for (const tx of transactions){
            const amount = parseInt(tx.amount);

            if(tx.type === "income") totalIncome += amount;
            if(tx.type === "expense") totalExpense += amount
        }

        const amountToAdd = parseInt(data.amount);

        if(
            data.type === "expense" &&
            totalIncome < totalExpense + amountToAdd
        ) {
            throw new BadRequestError("Income Bulan ini tidak mencukupi");
        }

        return await transaction.create(data);
    }

    async update(id, data) {
        const transaction = await Transaction.findByPk(id);
        if(!transaction) throw new NotFound("Transaksi Tidak ditemukan");
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        const transactions = await Transaction.findAll({
            where: {
                user_id: data.user_id,
                date: {
                    [Op.between]: [startOfMonth, endOfMonth]
                }
            }
        });

        let totalIncome = 0;
        let totalExpense = 0;

        for (const tx of transactions){
            const amount = parseInt(tx.amount);

            if(tx.type === "income") totalIncome += amount;
            if(tx.type === "expense") totalExpense += amount
        }

        const amountToAdd = parseInt(data.amount);

        if(
            data.type === "expense" &&
            totalIncome < totalExpense + amountToAdd
        ) {
            throw new BadRequestError("Income Bulan ini tidak mencukupi");
        }
        return await transaction.update(data);
    }

    async delete(id) {
        const transaction = await Transaction.findByPk(id);
        if(!transaction) throw new NotFound("Transaksi Tidak ditemukan");
        await transaction.destroy();
        return true
    }
}

module.exports = new TransactionService();