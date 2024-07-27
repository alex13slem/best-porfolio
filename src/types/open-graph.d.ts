export interface OpenGraphProps {
  siteName: string;
  title: string;
  description?: string;
  imageUrls: {
    fb: string;
    tg?: string;
    vk?: string;
    tw?: string;
  };
  imageSize?: {
    width: number;
    height: number;
  };
  type?: 'website' | 'profile' | 'book' | 'article';
  // | 'video.movie'
  // | 'video.episode'
  // | 'video.tv_show'
  // | 'video.other';
  profile?: {
    first_name: string;
    last_name: string;
    username: string;
    gender: 'male' | 'famale';
  };
  book?: {
    authors: string[];
    isbn: string;
    release_date: Date;
    tags: string[];
  };
  atricle?: {
    published_time: Date;
    modified_time: Date;
    expiration_time: Date;
    authors: string[];
    section: string;
    tags: string[];
  };
}
