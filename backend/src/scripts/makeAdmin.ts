import mongoose from 'mongoose'
import dotenv from 'dotenv'
import User from '../models/User'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../../.env') })

const makeAdmin = async () => {
    const email = process.argv[2]
    if (!email) {
        console.error('Uso: ts-node src/scripts/makeAdmin.ts <email>')
        process.exit(1)
    }

    await mongoose.connect(process.env.MONGO_URI!)

    const user = await User.findOneAndUpdate({ email }, { role: 'admin' }, { new: true })

    if (!user) {
        console.error('Usuario no encontrado:', email)
        process.exit(1)
    }

    console.log(`✅ ${user.fullName} (${user.email}) ahora es admin`)
    await mongoose.disconnect()
}

makeAdmin()
