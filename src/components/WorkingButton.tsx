import { useEffect, useState } from 'react';

import Button from './Button.tsx';

export default function WorkingButton() {
    const [startTime] = useState(new Date());
    const [currentTime, setCurrentTime] = useState(startTime);

    const numPeriods = Math.floor((currentTime - startTime) / 1000) % 3 + 1;

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <Button type="button" style={{ borderRadius: "5px", cursor: "not-allowed" }}>
            Working{ ".".repeat(numPeriods) }
        </Button>
    );
};
