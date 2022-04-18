from typing import Iterable, Tuple

import requests

karafun_catalog_overview_url = "https://www.karafun.com/karaoke-song-list.html"
csv_link_text = "Available in CSV format"


def extract_csv_link():
    catalog_overview_page = requests.get(karafun_catalog_overview_url)
    csv_link_line = [line for line in catalog_overview_page.text.split("\n") if csv_link_text in line]
    csv_link_line = list(csv_link_line)[0].strip().split()
    csv_link_line = [attr for attr in csv_link_line if attr.startswith("href")][0]
    return csv_link_line[6:-1]


def fetch_csv_file(csv_link: str) -> map:
    csv_file = requests.get(csv_link)
    lines = csv_file.text.split("\n")
    return map(lambda line: line.split(";"), lines)


def remove_quotes(entry: Tuple[str, str]) -> Tuple[str, str]:
    return entry[0].strip('"'), entry[1].strip('"')


def extract_artist_and_song(entries: Iterable) -> map:
    entries_without_header = (entry for index, entry in enumerate(entries) if index != 0)
    filled_entries_only = filter(lambda x: len(x) >= 3, entries_without_header)
    artist_song_map = map(lambda x: (x[2], x[1]), filled_entries_only)
    clean_artist_song_map = map(remove_quotes, artist_song_map)
    return clean_artist_song_map


def write_catalog_file(songs: Tuple[str, str]) -> None:
    first_line = "export const catalog = `\n"
    song_lines = map(lambda x: ';'.join(x), songs)
    last_line = "`"

    with open('../src/assets/karafun_catalog.js', 'w', encoding='utf-8') as file:
        file.write(first_line)
        for line in song_lines:
            file.write(line)
            file.write("\n")
        file.write(last_line)


csv_link = extract_csv_link()
csv_entries = fetch_csv_file(csv_link)
songs = extract_artist_and_song(csv_entries)
write_catalog_file(songs)