import logging
import grequests
import gevent.monkey
from argparse import ArgumentParser
from bs4 import BeautifulSoup
gevent.monkey.patch_ssl()
import requests

log = logging.getLogger(__name__)

URL = 'https://www.wowbagger.com/process.php'

# def fetch_page():
#     response = requests.get(URL)
#     if response.status_code == 200:
#         return response.content
#     else:
#         log.warn('Failed to fetch insult')
#         return None


def parse_insult(page: str) -> str:
    html = BeautifulSoup(page, 'html.parser')
    segments = html.findAll('span', {'class': 'customBig'})
    if segments:
        return segments[0].string


def new_parser() -> ArgumentParser:
    parser = ArgumentParser()
    parser.add_argument('-n',
                        metavar='<int>',
                        required=True,
                        type=int,
                        help="Number of insults to fetch",
                        default=1)
    parser.add_argument('--async', action='store_true')
    return parser


def read_arguments():
    parser = new_parser()
    return parser.parse_args()


def is_valid(resp: requests.Response) -> bool:
    return hasattr(resp, "status_code") and resp.status_code == 200


def get_async(n: int, *args, **kwargs):
    rs = (grequests.get(URL) for _ in range(n))
    responses = grequests.imap(rs, *args, **kwargs)
    pages = (resp.content for resp in responses if is_valid(resp))
    return (parse_insult(page) for page in pages)


def get_sync(n: int):
    for i in range(n):
        resp = requests.get(URL)
        if is_valid(resp):
            yield parse_insult(resp.content)


def main(n: int, async: bool=True):
    insults = get_async(n, size=6) if async else get_sync(n)

    for ins in insults:
        print(ins)


if __name__ == "__main__":
    arguments = read_arguments()
    main(arguments.n, arguments.async)
