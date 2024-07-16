# ndgr-reader

仮サーバーのコメント読むやつです

git submodule を解決した後 `pnpm build` した後 `pnpm start` で動くはず

(Protobufの生成コードを gitignore しているので一回 `pnpm build` しないと LSP 類が動かない)

## URL⇔Protobuf対応表

| URL | 型名 | stream? |
| --- | --- | --- |
| `https://mpn.live.nicovideo.jp/api/view/v4/...?at=...` | `dwango.nicolive.chat.service.edge.ChunkedEntry` | true |
| `https://mpn.live.nicovideo.jp/data/segment/v4/...` | `dwango.nicolive.chat.service.edge.ChunkedMessage` | true |
| `https://mpn.live.nicovideo.jp/data/snapshot/v4/...` | ? | true |
| `https://mpn.live.nicovideo.jp/data/backward/v4/...` | `dwango.nicolive.chat.service.edge.PackedSegment` | false |

