import React from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { Button, Row, Col } from "react-bootstrap";
import { useState } from "react";
import { useEffect } from "react";

export const MovieView = ({ movies, username, favoriteMovies }) => {
  const { movieId } = useParams();
  const storedToken = localStorage.getItem("token");
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const movie = movies.find((m) => m.id === movieId);

  const [movieExists, setMovieExists] = useState(false);
  const [userFavoriteMovies, setUserFavoriteMovies] = useState((storedUser && storedUser.FavoriteMovies) ? storedUser.FavoriteMovies : favoriteMovies);

  console.log(username)

  // AddFavMovie
  const addFavoriteMovie = () => {
    fetch(`https://meineflix.herokuapp.com/users/${username}/movies/${movieId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${storedToken}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Something went wrong");
        }
      })
      .then((data) => {
        setUserFavoriteMovies(data?.FavoriteMovies || []);
        alert("Movie added to favorites");
        localStorage.setItem("user", JSON.stringify(data));
      })
      .catch((error) => {
        console.error(error);
        alert("Something went wrong");
      });
  };

  const removeFavoriteMovie = () => {
    fetch(`https://meineflix.herokuapp.com/users/${username}/movies/${movieId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${storedToken}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Something went wrong");
        }
      })
      .then((data) => {
        setUserFavoriteMovies(data?.FavoriteMovies || []);
        alert("Movie removed from favorites");
        localStorage.setItem("user", JSON.stringify(data));
      })
      .catch((error) => {
        console.error(error);
        alert("Something went wrong");
      });
  };

  const movieAdded = () => {
    const hasMovie = userFavoriteMovies && userFavoriteMovies.some((m) => m === movieId);
    console.log("userFavMov", userFavoriteMovies);
    console.log("movieId", movieId);
    if (hasMovie) {
      setMovieExists(true);
    }
  };

  console.log("movieExists", movieExists);

  useEffect(() => {
    movieAdded();
  }, []);

  return (
    <Row className="movie-view">
    <Col md={6} className="movie-poster"  >
      <img className="movie-img" crossOrigin="anonymous" src={movie.image} />
    </Col>
    <Col md={6}>
      <div className="movie-title">
        <span className="value"><h2>{movie.title}</h2></span>
      </div>
      <div className="movie-description">
        <span className="label"><h5>Description: </h5></span>
        <span className="value">{movie.description}<br></br><br></br></span>
      </div>
      <Link to={`/`}>
        <Button className="back-button button-primary">Back</Button>
      </Link>
      <br />
      <br />
      <Button 
        className="button-add-favorite"
        onClick={addFavoriteMovie}
        disabled={movieExists}
      >
        + Add to Favorites
      </Button>
      <br/>
      <br/>
      <Button 
        variant="danger"
        onClick={removeFavoriteMovie}
        
      >
        Remove from Favorites
      </Button> 
    </Col>
  </Row>
  );
};