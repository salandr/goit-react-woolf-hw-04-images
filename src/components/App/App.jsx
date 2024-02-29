import ErrorComponent from 'components/ErrorComponent';
import ImageGallery from 'components/ImageGallery';
import LoadMoreButton from 'components/LoadMoreButton';
import Loader from 'components/Loader';
import SearchBar from 'components/SearchBar';
import { PER_PAGE, getImages } from 'services/api';
import { AppWrapper } from './App.styled';
import { useState, useEffect } from 'react';

const App = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [isLoadMoreShown, setIsLoadMoreShown] = useState(false);

  const autoScroll = () => {
    const gallery = document.querySelector('.gallery');

    if (gallery) {
      const { height: cardHeight } =
        gallery.firstElementChild.getBoundingClientRect();

      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
    }
  };
  const setErrorMessage = message => {
    setError(message);
    setIsLoadMoreShown(false);
  };

  const onSubmitSearch = value => {
    if (value === search) return;
    setSearch(value);
    setImages([]);
    setPage(1);
  };

  const onLoadMoreClick = () => {
    setPage(prevState => prevState + 1);
  };

  useEffect(() => {
    autoScroll();
  }, [images]);

  useEffect(() => {
    if (search === '') return;

    setIsLoading(true);
    setError(null);
    setIsLoadMoreShown(true);

    getImages(search, page)
      .then(({ hits: fetchedImages, totalHits }) => {
        setImages(prevState => [...prevState, ...fetchedImages]);
        setIsLoadMoreShown(page < Math.ceil(totalHits / PER_PAGE));
      })
      .catch(err => {
        setError(err.message);
        setIsLoadMoreShown(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [search, page]);

  return (
    <AppWrapper>
      <SearchBar setError={setErrorMessage} setValue={onSubmitSearch} />
      {error && <ErrorComponent message={`Error occured! ${error}`} />}
      {isLoading && <Loader />}
      {!error && <ImageGallery images={images} />}

      {!isLoading && isLoadMoreShown && (
        <LoadMoreButton onClick={onLoadMoreClick} />
      )}
    </AppWrapper>
  );
};

export default App;
