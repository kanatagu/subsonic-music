import { useEffect, useState } from 'react';
import styles from './Carousel.module.css';
import axiosClient from '../../api/base';
import { BASE_PARAM, FORMAT } from '../../const/apiParam';
import { TrackList } from '../TrackList/TrackList';

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const Carousel = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [albums, setAlbums] = useState([]);
  const [selectedAlbumIndex, setSelectedAlbumIndex] = useState(0);
  const [selectedAlbumInfo, setSelectedAlbumInfo] = useState({
    id: null,
    name: null,
  });

  useEffect(() => {
    const getLatestAlbums = async () => {
      try {
        setIsLoading(true);

        const response = await axiosClient.get(
          `/getAlbumList2${BASE_PARAM}&f=${FORMAT}&type=recent`
        );

        const albumArray = response.data['subsonic-response'].albumList2.album;

        console.log('albumArray', albumArray);
        setAlbums(albumArray);
        setSelectedAlbumInfo({
          id: albumArray[0].id,
          name: albumArray[0].name,
        });
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    getLatestAlbums();
  }, []);

  const handleNextClick = () => {
    const newIndex =
      selectedAlbumIndex === albums.length - 1 ? 0 : selectedAlbumIndex + 1;

    setSelectedAlbumIndex(newIndex);
    setSelectedAlbumInfo({
      id: albums[newIndex].id,
      name: albums[newIndex].name,
    });
  };

  const handlePrevClick = () => {
    const newIndex =
      selectedAlbumIndex === 0 ? albums.length - 1 : selectedAlbumIndex - 1;

    setSelectedAlbumIndex(newIndex);
    setSelectedAlbumInfo({
      id: albums[newIndex].id,
      name: albums[newIndex].name,
    });
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <div className={styles.carousel}>
        <button aria-label='Select Left Album' onClick={handlePrevClick}>
          &lArr;
        </button>
        <div className={styles['carousel-list']}>
          {albums.map((item, index) => (
            <div
              key={item.id}
              className={`${styles['img-wrapper']} ${
                index === selectedAlbumIndex ? styles.active : ''
              }`}
              style={{
                transform: `translateX(calc(212% - (178px * ${selectedAlbumIndex})))`,
              }}
            >
              <img
                src={`${baseUrl}/getCoverArt${BASE_PARAM}&id=${item.id}`}
                alt={`Cover art of ${albums[index].name}`}
              />
            </div>
          ))}
        </div>
        <button aria-label='Select Left Album' onClick={handleNextClick}>
          &rArr;
        </button>
      </div>

      <TrackList selectedAlbumInfo={selectedAlbumInfo} />
    </div>
  );
};
