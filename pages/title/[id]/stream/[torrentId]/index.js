/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-nested-ternary */
import React, {
  useContext, useState, useEffect,
} from 'react';
import AppContext from 'context/AppContext';
import { useRouter } from 'next/router';
import { TMDB_PHOTO_URL } from 'constants';
import { HOME_ROUTE } from 'routes';
import {
  Header, AppWrapper, BackButton, Spinner, Player,
} from 'components';
import { getTitleData } from 'api/titles';
import { getStreamingData, getSubtitles, startStreaming } from 'api/streaming';
import { useTranslation } from 'react-i18next';
import styles from './index.module.css';

const STREAMING_URL = process.env.NEXT_PUBLIC_STREAMING_URL;

const formatTracks = (subs) => {
  if (!subs) return null;
  const arr = [];
  Object.values(subs).forEach((sub) => {
    arr.push({
      label: sub.lang, kind: 'captions', srclang: sub.langcode, src: sub.vtt,
    });
  });
  return arr;
};

const Stream = () => {
  const {
    data: { userData },
  } = useContext(AppContext);
  const [title, setTitle] = useState({});
  const [torrent, setTorrent] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { query: { id, torrentId } } = useRouter();
  const [videoOptions, setVideoOptions] = useState({
    autoplay: true,
    controls: true,
  });

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await getTitleData(id, userData.language);
        setTitle(await data);
        return data;
      } catch (err) {
        throw new Error(err);
      }
    };
    if (id && userData !== undefined && !title.id) {
      getData();
    }
  }, [userData]);

  useEffect(async () => {
    if (torrent && isLoading) {
      setTimeout(async () => {
        const { files } = await getStreamingData(torrent);
        if (files) {
          const { link } = await files.find((file) => file.name.endsWith('.mp4' || '.mkv'));
          setVideoOptions({ ...videoOptions, sources: [{ src: `${STREAMING_URL}${link}` }] });
          setTimeout(() => {
            setIsLoading(false);
          }, 2000);
        } else {
          setProgress(progress + 0.0000001);
        }
      }, 1000);
    }
  }, [torrent, progress, isLoading]);

  useEffect(() => {
    const getStreaming = async () => {
      const { infoHash } = await startStreaming(torrentId);
      const { subs } = await getSubtitles(title.imdb_id);
      setVideoOptions({ ...videoOptions, tracks: formatTracks(subs) });
      setTorrent(infoHash);
    };
    if (process.browser && torrentId && title.imdb_id) {
      getStreaming();
    }
  }, [torrentId, title]);

  const { t } = useTranslation();

  if (isLoading) {
    return (
      <>
        <div style={{ backgroundImage: `url(${`${TMDB_PHOTO_URL}/${title.backdrop_path}`})` }} className={`${styles.titleBackground} absolute block w-full bg-no-repeat bg-cover opacity-40 h-screen`} />
        <div className="flex items-center h-screen justify-center content-center z-20">
          <div className="flex flex-col items-center">
            <Spinner border="border-gray-400" />
            <span className={`${styles.loadingText} text-white mt-4`}>{t('LOADING')}</span>
          </div>

        </div>
      </>
    );
  }

  return (
    <div>
      <Header
        leftContent={(
          <BackButton link={HOME_ROUTE} customText={`${t('WATCHING')}: ${title.title}`} />
        )}
        transparent
      />
      <AppWrapper>
        <div className="h-screen flex items-center justify-center text-white">
          {videoOptions.sources?.length > 0 && videoOptions.tracks?.length > 0 && <Player {...videoOptions} name="media" />}
        </div>
      </AppWrapper>
    </div>
  );
};

export default Stream;
