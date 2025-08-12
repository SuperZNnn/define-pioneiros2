import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ApiRequests } from '../services/api';

const CreateSession = () => {
    const navigate = useNavigate();
    const { name, token } = useParams();

    useEffect(() => {
        ApiRequests.createSessionByToken(token!, name!)
            .then((res) => {
                const resData = res.data as {
                    message: string;
                    user: {
                        display_name: string;
                        is_old: number;
                        login: string;
                        origin_id: string;
                    };
                };
                navigate('/oldupdate', {
                    state: { url: 'http://localhost:5173', user: resData.user },
                });
            })
            .catch(() => {
                window.location.href = 'http://localhost:5173';
            });
    }, []);

    return <pre>Carregando...</pre>;
};
export default CreateSession;
