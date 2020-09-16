# hello-search-javascript
FreeText search based in javascript


Reference:
[Lets build a full text search engine](https://artem.krylysov.com/blog/2020/07/28/lets-build-a-full-text-search-engine/)

[Porter Stemmer](https://tartarus.org/martin/PorterStemmer/js.txt)

### Design
``` sequence
Title: Document Importer

Importer->Analyser:Array of\nraw text
Analyser->Importer: tokenized text
Importer->Indexer: tokenized text
Indexer->Importer: index entry
Importer->Storage: index entry

```

``` sequence
Title: Analyser

Analyser->Tokinizer: line of\nraw text
Note over Tokinizer: each word broken on space\nwith position offset
Tokinizer->Filters_ToLower: tokens
Filters_ToLower->Filters_ToASCII: tokens
Filters_ToASCII->Filters_ToStopWords: tokens
Filters_ToStopWords->Filters_ToStemmer: tokens
Filters_ToStemmer->Filters_ToStopWords: tokens
Filters_ToStopWords->Tokinizer: tokens
Tokinizer-->Analyser: tokens

```

``` sequence
Title: Query

Query->Analyser:Array of\nraw text
Analyser->Query: tokens
Query->Index:tokens
Index->Query:array of document ids
Query->Index: tokenized text
Query->Storage: document ids
Storage->Query: documents

```