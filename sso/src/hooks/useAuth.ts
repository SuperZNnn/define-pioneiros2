import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';

export const googleLogin = (callback: (res: any) => void) => {
    signInWithPopup(auth, googleProvider)
        .then((res) => {
            callback(res);
        })
        .catch((err) => {
            console.log(err);
        });
};
