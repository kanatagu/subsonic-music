import { useEffect, useState } from 'react';
import styles from '../TrackList/TrackList.module.css';
import axiosClient from '../../api/base';
import { BASE_PARAM, FORMAT } from '../../const/apiParam';

export const TrackList = ({ selectedAlbumInfo }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [trackList, setTrackList] = useState([]);

  useEffect(() => {
    const getAlbum = async () => {
      try {
        setIsLoading(true);

        const response = await axiosClient.get(
          `/getAlbum${BASE_PARAM}&f=${FORMAT}&id=${selectedAlbumInfo.id}`
        );

        const data = response.data['subsonic-response'].album.song.map(
          (song) => ({
            track: song.track || '-',
            title: song.title,
          })
        );
        setTrackList(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (selectedAlbumInfo.id) {
      getAlbum();
    }
  }, [selectedAlbumInfo.id]);

  return (
    <div className={styles['track-list']}>
      <h2 className={styles['track-list_title']}>{selectedAlbumInfo.name}</h2>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <table className={styles['track-list_table']}>
          <thead>
            <tr>
              <th>#</th>
              <th>Track</th>
            </tr>
          </thead>
          <tbody>
            {trackList.map((song, index) => (
              <tr key={index}>
                <td className={styles['track-list_track']}>{song.track}</td>
                <td className={styles['track-list_title']}>{song.title}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
