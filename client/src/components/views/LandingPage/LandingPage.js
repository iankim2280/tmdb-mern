import React, { useEffect, useState, useRef } from "react";
import { API_URL, API_KEY, IMAGE_BASE_URL } from "../../Config";
import { Typography, Row } from "antd";
import MainImage from "./Sections/MainImage";
import GridCards from "../Commons/GridCards";

const { Title } = Typography;

const LandingPage = () => {
  const buttonRef = useRef(null);
  const [Movies, setMovies] = useState([]);
  const [MainMovieImage, setMainMovieImage] = useState(null);

  const [Loading, setLoading] = useState(true);
  const [CurrentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const endpoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=1`;
    fetchMovies(endpoint);
  }, []);

  const fetchMovies = (endpoint) => {
    fetch(endpoint)
      .then((result) => result.json())
      .then((result) => {
        // console.log(result)
        // console.log('Movies',...Movies)
        // console.log('result',...result.results)
        setMovies([...Movies, ...result.results]);
        setMainMovieImage(MainMovieImage || result.results[0]);
        setCurrentPage(result.page);
      }, setLoading(false))
      .catch((error) => console.error("Error:", error));
  };

  const loadMoreItems = () => {
    let endpoint = "";
    setLoading(true);
    console.log("CurrentPage", CurrentPage);
    endpoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=${
      CurrentPage + 1
    }`;
    fetchMovies(endpoint);
  };
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
  }, []);

  const handleScroll = () => {
    const windowHeight =
      "innerHeight" in window
        ? window.innerHeight
        : document.documentElement.offsetHeight;
    const body = document.body;
    const html = document.documentElement;
    const docHeight = Math.max(
      body.scrollHeight,
      body.offsetHeight,
      html.clientHeight,
      html.scrollHeight,
      html.offsetHeight
    );
    const windowBottom = windowHeight + window.pageYOffset;
    if (windowBottom >= docHeight - 1) {
      // loadMoreItems()
      console.log("clicked");
      buttonRef.current.click();
    }
  };

  // MainMovieImage is existed then do something

  return (
    <div style={{ width: "100%", margin: "0" }}>
      {MainMovieImage && (
        <MainImage
          title={MainMovieImage.original_title}
          text={MainMovieImage.overview}
          image={`${IMAGE_BASE_URL}w1280${MainMovieImage.backdrop_path}`}
        />
      )}
      <div style={{ width: "85%", margin: "1rem auto" }}>
        <Title level={2}> Movies by latest </Title>
        <hr />
        <Row gutter={[16, 16]}>
          {Movies &&
            Movies.map((movie, index) => (
              <React.Fragment key={index}>
                <GridCards
                  image={
                    movie.poster_path
                      ? `${IMAGE_BASE_URL}w500${movie.poster_path}`
                      : null
                  }
                  movieId={movie.id}
                  movieName={movie.original_title}
                />
              </React.Fragment>
            ))}
        </Row>
        {Loading && <div>Loading...</div>}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          paddingBottom: "15px",
        }}
      >
        <button ref={buttonRef} onClick={loadMoreItems}>
          Load More
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
