import {model, Document, Schema} from 'mongoose'

export interface IHistory extends Document {
    created_at: Date,
    title: String,
    donwload_link: String,
}

const historySchema = new Schema();


