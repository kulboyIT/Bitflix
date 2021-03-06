import PropTypes from 'prop-types';
import React, { useState } from 'react';
import Link from 'next/link';
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem,
} from '@radix-ui/react-dropdown-menu';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import { GENRE_ROUTE, HOME_ROUTE } from 'routes';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import { genres } from 'constants';
import HeaderMenu from './HeaderMenu';
import styles from './header.module.css';

const Header = ({ leftContent, transparent }) => {
  const { t } = useTranslation();
  const { asPath, query: { id } } = useRouter();
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(!open);
  };

  return (
    <div style={{ backgroundColor: transparent ? 'transparent' : '#080808d9' }} className={`${!transparent && styles.header} fixed w-full px-4 sm:px-6 md:px-24 2xl:px-32 h-16 flex items-center z-30 ${!transparent && 'shadow-xl'}`}>
      <div className="py-5 flex items-center w-full justify-between">
        <div className="flex items-center">
          {leftContent || (
            <div className="flex items-center">
              <Link href={HOME_ROUTE}>
                <span className="text-white text-xl lg:text-2xl font-semibold cursor-pointer select-none">
                  {t('MOVIES')}
                </span>
              </Link>
              <div className="ml-4 md:ml-8 xl:ml-12">
                <DropdownMenu open={open} onOpenChange={handleOpen}>
                  <DropdownMenuTrigger className="hover:bg-gray-800 rounded-md px-4 py-2 cursor-pointer transition duration-300" asChild>
                    <div className="flex items-center text-white">
                      <span>{!asPath.startsWith(GENRE_ROUTE) ? t('ALL_GENRES') : t(genres.find((genre) => genre.id === +id).name)}</span>
                      <ChevronDownIcon className="ml-2" />
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-gray-900 text-white rounded-sm shadow-xl py-2 transition duration-200 px-2 text-sm flex flex-col w-48" sideOffset={5}>
                    <Link href={HOME_ROUTE}>
                      <DropdownMenuItem
                        className={`${asPath === HOME_ROUTE ? 'bg-primary hover:bg-primary' : 'hover:bg-gray-800'} text-white rounded-sm px-2 py-1 mb-1 cursor-pointer transition duration-300`}
                        onClick={handleOpen}
                      >
                        {t('ALL_GENRES')}
                      </DropdownMenuItem>
                    </Link>
                    {genres?.map((genre) => (
                      <Link href={`${GENRE_ROUTE}/${genre.id}`} key={`genre-header-menu-${genre.id}`}>
                        <DropdownMenuItem
                          className={`${asPath === `${GENRE_ROUTE}/${genre.id}` ? 'bg-primary hover:bg-primary' : 'hover:bg-gray-800'} text-white rounded-sm px-2 py-1 mb-1 cursor-pointer transition duration-300`}
                          onClick={handleOpen}
                        >
                          {t(genre.name)}
                        </DropdownMenuItem>
                      </Link>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          )}
        </div>
        <HeaderMenu />
      </div>
    </div>
  );
};

Header.propTypes = {
  leftContent: PropTypes.element,
  transparent: PropTypes.bool,
};

Header.defaultProps = {
  leftContent: null,
  transparent: false,
};

export default Header;
