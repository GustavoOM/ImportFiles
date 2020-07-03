import AppError from '../errors/AppError';

import {getCustomRepository, getRepository} from 'typeorm'

import TransactionsRepository from '../repositories/TransactionsRepository'
 
import Transaction from '../models/Transaction';

import Category from "../models/Category"

interface Request{
  title: string,
  type: 'income' | 'outcome',
  value: number,
  category: string,
}

class CreateTransactionService {
  public async execute({title, value, type, category}: Request): Promise<Transaction> {
    category.toUpperCase

    const transactionRepository = getCustomRepository(TransactionsRepository)
    const categoryRespository = getRepository(Category)

    const {total} = await transactionRepository.getBalance()

    if ( type === "outcome" && total < value){
      throw new AppError('You do not have enough balance')
    }

    let transactionCategory = await categoryRespository.findOne({
      where: {
        title: category
      }
    })

    console.log(transactionCategory)

    if(!transactionCategory){
      transactionCategory = categoryRespository.create({
        title: category,
      })

      await categoryRespository.save(transactionCategory)
    }

    console.log(transactionCategory)

    const transaction = transactionRepository.create({
      title,
      value,
      type,
      category: transactionCategory,
    })

    await transactionRepository.save(transaction)

    return transaction
  }
}

export default CreateTransactionService;
