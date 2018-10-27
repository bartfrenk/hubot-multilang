import logging
#import requests
from requests import async
from argparse import ArgumentParser
from bs4 import BeautifulSoup

log = logging.getLogger(__name__)

URL = 'https://www.wowbagger.com/process.php'


def fetch_page():
    response = requests.get(URL)
    if response.status_code == 200:
        return response.content
    else:
        log.warn('Failed to fetch insult')
        return None

def parse_insult(page):
    html = BeautifulSoup(page, 'html.parser')
    return html.findAll('span', {'class': 'customBig'})



def new_parser():
    parser = ArgumentParser()
    parser.add_argument(
        '-n', metavar='<int>', type=int,
        help="Number of insults to fetch",
        default=1)
    return parser


def read_arguments():
    parser = new_parser()
    return parser.parse_args()


def get_async(n, size):
    rs = [async.get(URL) for _ in range(n)]
    pages = [p for p in async.map(rs) if p.status_code == 200]
    return pages



if __name__ == "__main__":
    arguments = read_arguments()
    insults = []
    get_async(arguments.n, 10)
    # for i in range(arguments.n):
    #     page = fetch_page()
    #     if page:
    #         parsed = parse_insult(page)
    #         if len(parsed) > 0:
    #             print(parsed[0].get_text())
