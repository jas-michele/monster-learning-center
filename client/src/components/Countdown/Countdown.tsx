import "./Countdown.css";

type CountdownProps = {
    value: string;
}

export default function Countdown({ value }: CountdownProps ){
    return (
        <div className="countdown">
            {value}
        </div>
    );
}