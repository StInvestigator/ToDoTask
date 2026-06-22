const Home = () => {
    return (
        <div className="text-center mt-5">
            <h1 className="display-4 fw-bold">The Ultimate ToDo App</h1>
            <p className="lead text-muted">Finally you can sort out your daily tasks.</p>
            <img
                src="https://static.vecteezy.com/system/resources/thumbnails/073/496/452/small/black-check-mark-inside-a-square-box-isolated-on-transparent-background-png.png"
                alt="Checklist"
                className="img-fluid mt-4"
                style={{ maxWidth: '300px' }}
            />
        </div>
    );
};

export default Home;