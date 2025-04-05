import { useBackendQuery } from '../utils/QueryUtils';

interface ILeaderboardEntry {
    username: string;
    score: number;
}

function LeaderboardDisplay() {
    const lbQuery = useBackendQuery<ILeaderboardEntry[]>("leaderboard");

    if(lbQuery.status === 'pending') {
        return <p>Loading...</p>;
    } else if(lbQuery.status === 'error') {
        return <p>Error: { lbQuery.error.message }</p>;
    }

    return (
        <table className="app-leaderboard">
            <tbody>
                <tr>
                    <th>Rank</th>
                    <th>User</th>
                    <th>Score</th>
                </tr>
                {
                    lbQuery.data.map((entry, i) => (
                        <tr key={i}>
                            <td>{ i + 1 }</td>
                            <td>{ entry.username }</td>
                            <td>{ entry.score }</td>
                        </tr>
                    ))
                }
                {
                    lbQuery.data.length === 0 && (
                        <tr>
                            <td colSpan={3}>
                                No users found.
                            </td>
                        </tr>
                    )
                }
            </tbody>
        </table>
    );
}

export default function LeaderboardContent() {
    
    return (
        <section className="container py-24 md:py-32">
            <div className="mx-auto max-w-[58rem] text-center">
                <h2 className="font-bold text-3xl leading-[1.1] sm:text-3xl md:text-5xl">
                    Leaderboard
                </h2>

                <p className="mt-4 sm:text-lg" style={{ margin: "30px 0" }}>
                    The DouBingo leaderboard.
                </p>

                <LeaderboardDisplay />
            </div>
        </section>
    );
};
