import React from 'react';
import '@powerfulyang/components/index.css';
import { PhotoSlider } from '@powerfulyang/components';

export const PhotoView = () => {
  const list = [
    'https://www.youmeitu.com/Upload/20200316/1584339817668879.jpg',
    'https://m.youmeitu.com/Upload/20200317/1584421195639765.jpg?x-oss-process=image/resize,m_fill,w_180,h_270',
    'https://m.youmeitu.com/Upload/20200317/1584421098198173.jpg?x-oss-process=image/resize,m_fill,w_180,h_270',
    'https://m.youmeitu.com/Upload/20200317/1584420731957545.jpg?x-oss-process=image/resize,m_fill,w_180,h_270',
    'https://m.youmeitu.com/Upload/20200311/1583904771985170.jpg?x-oss-process=image/resize,m_fill,w_180,h_270',
    'https://m.youmeitu.com/Upload/20200311/1583901892638513.jpg?x-oss-process=image/resize,m_fill,w_180,h_270',
    'https://m.youmeitu.com/Upload/20200311/1583900783700096.jpg?x-oss-process=image/resize,m_fill,w_180,h_270',
    'https://m.youmeitu.com/Upload/20200309/1583730412665515.jpg?x-oss-process=image/resize,m_fill,w_180,h_270',
    'https://m.youmeitu.com/Upload/20200305/1583378186576773.jpg?x-oss-process=image/resize,m_fill,w_180,h_270',
    'https://m.youmeitu.com/Upload/20200302/1583125729847921.jpg?x-oss-process=image/resize,m_fill,w_180,h_270',
    'https://m.youmeitu.com/Upload/20200227/1582789841481682.png?x-oss-process=image/resize,m_fill,w_180,h_270',
    'https://static.acgsoso.com/uploads/2020/03/205c323f2bb7d21afb0482c3330ea3aa-488x600.jpg',
    'https://static.acgsoso.com/uploads/2020/03/3ae90666814978e90d381e0ed9c863ef-421x600.jpg',
    'https://static.acgsoso.com/uploads/2020/03/3d6bd3edd87a535e9944053b2ff82595-424x600.jpg',
    'https://static.acgsoso.com/uploads/2020/03/56d7bd0477f04980d31e676b55c23459-800x533.jpg',
    'https://static.acgsoso.com/uploads/2020/03/ab0f68e570ef51136333e14e67766fd9-400x600.jpg',
    'https://static.acgsoso.com/uploads/2019/07/1d41e6f55521cdba4fc73febd09d2eb4-22-800x450.jpg',
    'https://static.acgsoso.com/uploads/2019/07/837ae25315bdf92433f9b911bdb6b4b5-15-800x450.jpg',
    'https://static.acgsoso.com/uploads/2019/07/b1721e7bf6abed8bfa90de07a02547bc-13-800x500.jpg',
    'https://static.acgsoso.com/uploads/2019/07/ee2468a702bdc29871e84d63e851dd26-17-756x600.jpg',
    'https://static.acgsoso.com/uploads/2019/07/cb958f461d123080a3367f26406edfc9-17-800x487.jpg',
    'https://static.acgsoso.com/uploads/2019/07/4363b12ae39947f045a4fb5fad740dc8-12-800x600.jpg',
    'https://sinaimg.acgsoso.com/large/007iocwWly1g5b3a8jfmyj31hb11pgo9',
    'https://sinaimg.acgsoso.com/large/007iocwWly1g5b39xubvdj31hb11p77d',
    'https://static.acgsoso.com/uploads/2019/07/1d41e6f55521cdba4fc73febd09d2eb4-17-800x511.jpg',
    'https://sinaimg.acgsoso.com/mw1024/006DgsQsly1ftdisvqkt2j31040lsn18.jpg',
    'https://sinaimg.acgsoso.com/mw1024/006DgsQsly1ftjbxd1hrqj30iw0qtax0.jpg',
    'https://sinaimg.acgsoso.com/mw1024/006DgsQsly1ftjbxbets6j30m80fq7g8.jpg',
    'https://sinaimg.acgsoso.com/mw1024/006DgsQsly1ftjbx2zfzvj30on0nmate.jpg',
    'https://sinaimg.acgsoso.com/mw1024/006DgsQsly1ftjbxmmhrtj30xc19bu0a.jpg',
    'https://sinaimg.acgsoso.com/large/007ZKdkxgy1gahzpw9kllj30p50zk780',
    'https://sinaimg.acgsoso.com/large/007ZKdkxgy1gc9pgag4gej30hs0owq97.jpg',
    'https://sinaimg.inn-studio.com/mw1024/007iocwWgy1fwrqqpr13yj30cx0i2q45.jpg',
    'https://sinaimg.inn-studio.com/mw1024/006DgsQsly1ftgnfihly2j30jn0rsww5.jpg',
    'https://sinaimg.inn-studio.com/large/005zWjpngy1ftrp16mt2oj30cb0i2wj3.jpg',
    'https://sinaimg.acgsoso.com/mw1024/007ZKdkxgy1ge0aompluqj30lc0u342q.jpg',
    'https://sinaimg.acgsoso.com/mw1024/007ZKdkxgy1ge0aoo1aezj30lc0u60uq.jpg',
    'https://sinaimg.acgsoso.com/mw1024/007ZKdkxgy1ge0aopmfqmj30lc0ryjta.jpg',
    'https://sinaimg.acgsoso.com/mw1024/007ZKdkxgy1ge0aornunnj30lc0dc0ue.jpg',
    'https://sinaimg.acgsoso.com/mw1024/007ZKdkxgy1gdzwwtla78j315o0seu0y.jpg',
    'https://sinaimg.acgsoso.com/mw1024/007ZKdkxgy1gdzwx1eorwj30mb0vkaws.jpg',
    'https://sinaimg.acgsoso.com/mw1024/007ZKdkxgy1gdzwxa1dw1j30u01851kx.jpg',
    'https://sinaimg.acgsoso.com/mw1024/007ZKdkxgy1gdzwxh7jdcj30nm0go7nc.jpg',
    'https://sinaimg.acgsoso.com/mw1024/007ZKdkxgy1gdzwy0rad7j30rs0y4qq6.jpg',
    'https://sinaimg.acgsoso.com/mw1024/007ZKdkxgy1gdzwzp4pt3j30xc1jub29.jpg',
  ];
  const listSrc = list.map((item) => ({ src: item }));
  return (
    <>
      <meta
        name="viewport"
        content="width=device-width,initial-scale=1.0,maximum-scale=1.0, user-scalable=0"
      />
      <h1 style={{ textAlign: 'center' }}>2020-04-21</h1>
      <PhotoSlider imgList={listSrc} />
    </>
  );
};

export default {
  title: 'photo-view',
  component: PhotoView,
};
