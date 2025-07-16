import admin from 'firebase-admin'

if (!admin.apps.length){
    admin.initializeApp({
        credential: admin.credential.cert(require('../../firebaseKey.json'))
    })
}
else{
    admin.app()
}

export const verifyIdToken = async (idToken: string) => {
    try{
        const decodedToken = await admin.auth().verifyIdToken(idToken)
        return decodedToken
    }
    catch (err){
        throw new Error('Token inválido ou expirado')
    }
}