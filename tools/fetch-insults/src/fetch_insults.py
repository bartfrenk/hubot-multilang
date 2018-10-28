import logging
import grequests
import gevent.monkey
from argparse import ArgumentParser
from bs4 import BeautifulSoup
gevent.monkey.patch_ssl()
import requests

log = logging.getLogger(__name__)

URL = 'https://www.wowbagger.com/process.php'
MAX_CONCURRENT_REQUESTS = 100

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


def new_arg_parser() -> ArgumentParser:
    parser = ArgumentParser()
    parser.add_argument(
        '-n',
        metavar='<int>',
        type=int,
        help='Number of insults to fetch (default=1)',
        default=1)
    parser.add_argument(
        '-c',
        metavar='<int>',
        type=int,
        help='Number of concurrent requests (default=number of insults)')
    parser.add_argument(
        '--timeout',
        metavar='<int>',
        type=int,
        help='Timeout (in seconds, default=10)',
        default=10)
    return parser


def read_arguments():
    parser = new_arg_parser()
    return parser.parse_args()


def get_async(n: int, timeout_s: int=10, *args, **kwargs):
    def is_valid(resp: requests.Response) -> bool:
        return hasattr(resp, "status_code") and resp.status_code == 200

    rs = (grequests.get(URL, timeout=timeout_s) for _ in range(n))
    responses = grequests.imap(rs, *args, **kwargs)
    pages = (resp.content for resp in responses if is_valid(resp))
    return (parse_insult(page) for page in pages)


def main(n: int, size: int=6, timeout_s: int=10):
    for ins in get_async(n, size=size, timeout_s=timeout_s):
        print(ins)


if __name__ == "__main__":
    arguments = read_arguments()
    size = arguments.c or min(arguments.n, MAX_CONCURRENT_REQUESTS)
    main(arguments.n, size, arguments.timeout)
