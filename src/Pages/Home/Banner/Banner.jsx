

const Banner = () => {
    return (
        <div>
            <div className="hero w-full h-[600px]" style={{ backgroundImage: 'url(https://img.freepik.com/free-vector/online-conference-isometric-illustration_1284-17977.jpg?size=626&ext=jpg&uid=R98662133&ga=GA1.1.1310670833.1708003840&semt=ais)' }}>
                <div className="hero-overlay bg-opacity-60"></div>
                <div className="hero-content text-center text-neutral-content">
                    <div className="max-w-md">
                        <h1 className="mb-5 text-5xl font-bold">Hello there</h1>
                        <p className="mb-5">Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem quasi. In deleniti eaque aut repudiandae et a id nisi.</p>
                        <button className="btn btn-primary">Get Started</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Banner;