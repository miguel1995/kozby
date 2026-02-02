export const ButtonPrimary = ({ text, clickHandler }) => {
    return (
        <Button type="primary" onClick={clickHandler}>
            {text}
        </Button>
    );
};