from soupify import soupify
from redis_proxy_client import RedisProxyClient
from random_headers_list import headers_list
from json import dumps
from kafka import KafkaProducer
import feedparser
from datetime import datetime
import pytz
from dateutil import parser
import dateutil.tz as tz
from dateutil.tz import UTC
from confluent_kafka import Producer

def scrap_article_title(headers_list, redis_config, redis_key, idx):
    tzinfos = {"CST": tz.gettz("America/Chicago"),
           "CDT": tz.gettz("America/Chicago"),                
           "EST": tz.gettz("America/Eastern"),
           "EDT": tz.gettz("America/Eastern")                 
           }
    redis = RedisProxyClient(redis_config, redis_key)
    rss_feed_URL = redis.lpop_item(f'rss_feed_list_{idx}')
    redis.health_check()
    try:
        p = Producer({'bootstrap.servers': 'kafka:9092'})

    except Exception as err:
        print(err)
    
    if rss_feed_URL is not None:
        news_feed = feedparser.parse(rss_feed_URL.decode('ascii'))
        for entry in news_feed.entries:
            try:
                parsed_date = parser.parse(entry.published, tzinfos=tzinfos)
                parsed_utc = parsed_date.astimezone(UTC).replace(tzinfo=None)
                now_time = datetime.utcnow()
                diff = now_time - parsed_utc
                if diff.days == 0 and entry.title != "object has no attribute 'published'":
                    print(entry.title)
                    p.produce('article_title', entry.title.encode('utf-8'))
                    # producer.send('article_title', str.encode(entry.title))
            except Exception as err:
                print(err)
        # producer.flush()
        p.flush()

            
def get_text(soup_with_tag):
    return soup_with_tag.text

if __name__ == "__main__":
    REDIS_CONFIG = {
        "host": "localhost",
        "port": "6378",
        "db": 0
    }
    scrap_article_title(
                        redis_config=REDIS_CONFIG,
                        redis_key='ips',
                        headers_list=headers_list
                        )