const url = '/';
const local_url = '/';
const site_name = 'サイト名';
const og_locale = 'jp_JP';
const og_type = 'website';
const twitter_card = 'summary_large_image';
const twitter_site = '@';
const title = {
	'home': 'TOPページのタイトル',
	'page': '下層ページのタイトル'
};
const description = {
	'home': 'TOPページの説明文',
	'page': '下層ページの説明文'
};
const ogimg = url+'img/ogp.png';
const favicon = '/img/favicon.ico';

module.exports = {
	"data": [
		{
			"name": 'pagelist',
			"url": url + 'pagelist.html',
			"local_url": local_url + 'pagelist.html',
			"title": '画面一覧',
			"page_title": '画面一覧',
			"level": 0,
			"description": '',
			"keywords": '',
			"favicon": favicon,
			"og": {
				"title": '',
				"description": '',
				"image": '',
				"type": og_type,
				"locale": '',
				"siteName": '',
				"url": ''
			},
			"twitter": {
				"title": '',
				"description": '',
				"image": '',
				"card": '',
				"site": '',
				"url": '',
				"text": ''
			},
			"dev_state": ''
		},{
			"name": 'home',
			"url": url,
			"local_url": local_url,
			"title": title['home'],
			"page_title": 'トップページ',
			"level": 1,
			"description": description['home'],
			"keywords": '',
			"favicon": favicon,
			"og": {
				"title": title['home'],
				"description": description['home'],
				"image": ogimg,
				"type": og_type,
				"locale": og_locale,
				"siteName": site_name,
				"url": url
			},
			"twitter": {
				"title": title['home'],
				"description": description['home'],
				"image": ogimg,
				"card": twitter_card,
				"site": twitter_site,
				"url": url,
				"text": ''
			},
			"dev_state": 'テストアップ'
		},{
			"name": 'page',
			"url": url + 'page/index.html',
			"local_url": local_url + 'page/index.html',
			"title": title['page'],
			"page_title": '下層ページ',
			"level": 1,
			"description": description['page'],
			"keywords": '',
			"favicon": favicon,
			"og": {
				"title": title['page'],
				"description": description['page'],
				"image": ogimg,
				"type": og_type,
				"locale": og_locale,
				"siteName": site_name,
				"url": url
			},
			"twitter": {
				"title": title['page'],
				"description": description['page'],
				"image": ogimg,
				"card": twitter_card,
				"site": twitter_site,
				"url": url,
				"text": ''
			},
			"dev_state": 'テストアップ'
		}
	]
}