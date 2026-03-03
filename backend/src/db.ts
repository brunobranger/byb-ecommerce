import mongoose from 'mongoose'

const connectDB = async (): Promise<void> => {
    try {
        const uri = process.env.MONGO_URI
        if (!uri) throw new Error('MONGO_URI was not defined in .env')
        await mongoose.connect(uri)
        console.log('MongoDB Connected')
    } catch (error) {
        console.error('Error attempting to connect MongoDB', error)
        process.exit(1) // Corta el proceso si no hay DB
    }
}

export default connectDB
