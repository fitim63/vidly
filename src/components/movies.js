import React, {Component} from "react";
import Pagination from "./common/pagination";
import ListGroup from "./common/listGroup";
import {paginate} from "../utils/paginate";
import {getMovies} from "../services/fakeMovieService";
import {getGenres} from "../services/fakeGenreService";
import MoviesTable from "./moviesTable";
import _ from 'lodash';

class Movies extends Component {

    state = {
        movies: [],
        genres: [],
        pageSize: 4,
        currentPage: 1,
        sortColumn: {path: "title", order: "asc"}
    };

    componentDidMount() {
        const genres = [{ _id: ""}, {name: 'All Genres'}, ...getGenres()];
        this.setState({movies: getMovies(), genres: genres});
    };

    // handleDelete = movie => {
    //     const mov = this.state.movies.filter(m => m._id !== movie._id);
    //     this.setState({ movies : mov });
    // };

    handleLike = (movie) => {
        const movies = [...this.state.movies];
        const index = movies.indexOf(movie);
        movies[index] = {...movies[index]};
        movies[index].liked = !movies[index].liked;
        this.setState({movies});
    };

    handlePageChange = page => {
        this.setState({currentPage: page});
    };

    handleGenreSelect = genre => {
        this.setState({selectedGenre: genre, currentPage: 1})
    };

    handleSort = sortColumn => {
        this.setState({sortColumn});
    };

    render() {
        const {pageSize, currentPage, selectedGenre, sortColumn} = this.state;
        if (this.state.movies.length === 0) return <p>There are no movies in the db</p>;

        const filter = selectedGenre && selectedGenre._id
            ? this.state.movies.filter(m => m.genre._id === selectedGenre._id)
            : this.state.movies;

        const sorted = _.orderBy(filter, [sortColumn.path], [sortColumn.order]);
        const moviesPaginate = paginate(sorted, currentPage, pageSize);
        return (
            <div className="row">
                <div className="col-2 m-2">
                    <ListGroup
                        items={this.state.genres}
                        selectedItem={this.state.selectedGenre}
                        onItemSelect={this.handleGenreSelect}/>
                </div>
                <div className="col">
                    <p> Showing {filter.length} movies in the database</p>
                    <MoviesTable moviesPaginate={moviesPaginate}
                                 sortColum={sortColumn}
                                 onLike={this.handleLike}
                                 onSort={this.handleSort} />
                    {/*// onDelete={this.handleDelete()}/>*/}
                    <Pagination itemsCount={filter.length}
                                pageSize={pageSize}
                                currentPage={currentPage}
                                onPageChange={this.handlePageChange}/>
                </div>
            </div>
        );
    }
}

export default Movies;