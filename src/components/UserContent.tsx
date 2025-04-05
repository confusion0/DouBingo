import { useUsername } from '../context/UsernameContext.tsx';

import { renderDatalessQuery, useBackendQuery } from '../utils/QueryUtils.tsx';

interface IUserData {
    score: number;
}

function UserDataDisplay() {
    const userQuery = useBackendQuery<IUserData>("user");

    if(userQuery.status !== 'success') {
        return renderDatalessQuery(userQuery);
    }

    return (
        <>
            <p className="mt-4 sm:text-lg" style={{ margin: "30px 0" }}>
                Score: { userQuery.data.score }
            </p>
        </>
    );
}

export default function UserContent() {
    const { username } = useUsername();
    
    return (
        <section className="container py-24 md:py-32">
            <div className="mx-auto max-w-[58rem] text-center">
                <h2 className="font-bold text-3xl leading-[1.1] sm:text-3xl md:text-5xl">
                    { username }
                </h2>

                <UserDataDisplay />
            </div>
        </section>
    );
};
