## [0.1.9](https://github.com/plebbit/plebones/compare/v0.1.8...v0.1.9) (2023-12-10)


### Bug Fixes

* **menu:** menu sometimes disappears on mobile ([bfafa95](https://github.com/plebbit/plebones/commit/bfafa95b3878c45d4194762e0fb04d67b5d0fbda))



## [0.1.8](https://github.com/plebbit/plebones/compare/v0.1.7...v0.1.8) (2023-12-07)


### Bug Fixes

* **menu:** don't run fixed menu animation on mobile overscroll behavior ([c801463](https://github.com/plebbit/plebones/commit/c801463ba280c2c4f3c2a173cd2269b00eefffde))
* **menu:** subscriptions don't have titles and don't use short address when not crypto names ([7a25378](https://github.com/plebbit/plebones/commit/7a25378d974009018558a31cf4a5495aec7d978a))


### Features

* add plebbit-rpc ([3e37103](https://github.com/plebbit/plebones/commit/3e37103cbfbeec4494c5d1700cf69a72828ecf3f))
* **challenge-modal:** add cancel button instead of closing on outside click ([bed21a4](https://github.com/plebbit/plebones/commit/bed21a4c0be252a6bbe8cc16314833bd2d31a72b))
* **electron:** launch plebbit rpc with auth key ([b3785af](https://github.com/plebbit/plebones/commit/b3785afbed1ddde742e7488ec15fab8f61f6a911))
* **feed-post:** removed post hides media ([078b666](https://github.com/plebbit/plebones/commit/078b666568be9d2ea7c08d28e0e575522c5a30bc))
* **settings:** reload page when editing plebbit options ([787184f](https://github.com/plebbit/plebones/commit/787184f5e19294c475bfa1e29f10f3e3b311e9ff))
* **subplebbit-settings:** add edit subplebbit settings ([abe87aa](https://github.com/plebbit/plebones/commit/abe87aa3159b3d559775d3a4abfac4f416658e42))
* **subplebbit:** add link to sub settings from title ([91b85ef](https://github.com/plebbit/plebones/commit/91b85ef4a3931a6002b8d45c9748a6b4c605ecda))
* **subplebbits:** add createdAt as label ([93c13d4](https://github.com/plebbit/plebones/commit/93c13d4e7897d356a14c15e9dfc45a93a1559024))
* **subplebbits:** add my subplebbits view ([0d90146](https://github.com/plebbit/plebones/commit/0d901465c12203ecd5a978c64a837cc6d1348d56))


### Reverts

* **subplebbits:** use custom subplebbits subplebbit feed css ([82f1c2f](https://github.com/plebbit/plebones/commit/82f1c2ffd575a33b6ebb372e71658fa90752bb14))



## [0.1.7](https://github.com/plebbit/plebones/compare/v0.1.6...v0.1.7) (2023-10-30)


### Bug Fixes

* **pending-post:** content shouldn't be used in title in pending post ([40f94c1](https://github.com/plebbit/plebones/commit/40f94c17062f99d46a5aafe122fd2223a45388ed))
* **post:** videos can't comfortably be scrolled so max the height to 85vh ([1bd533b](https://github.com/plebbit/plebones/commit/1bd533b9e2c08d1fdf4015f48106ab33f71e9aee))


### Features

* **catalog:** postPerPage based on columnCount for optimized feed ([d83e45a](https://github.com/plebbit/plebones/commit/d83e45a2241f3842ea99d4afb1ddcc3ba796e784))
* **home:** experimental time filter on all sorts ([88def1a](https://github.com/plebbit/plebones/commit/88def1affcc1521c5ad60fdd061f0e14314dbd77))
* **hooks:** automatically use last visit timestamp as time filter ([23a1717](https://github.com/plebbit/plebones/commit/23a1717daf99857b5023edd85561d88778a8f69f))
* **hooks:** show deleted comment label ([92a6b8a](https://github.com/plebbit/plebones/commit/92a6b8a533792a3004c34a42223ce26b52085673))
* **menu:** add time filter to menu ([1b42556](https://github.com/plebbit/plebones/commit/1b4255662e902caa0d81e8796ec2b707379f37af))
* **menu:** set router params.subplebbitAddress as default when submitting ([9d4dd96](https://github.com/plebbit/plebones/commit/9d4dd96340c5aedecb60f901c38efe7eb74e4d8b))
* **menu:** sticky menu ([b602524](https://github.com/plebbit/plebones/commit/b602524ec73af9d2e45fd9fc70dd733679765bef))
* **pending-post:** redirect pending reply to parent post ([3fbd8a4](https://github.com/plebbit/plebones/commit/3fbd8a4d84d6ce4294ca6f3aedd7e80e9e9ffa32))
* **post-tools:** share copies to clipboard ([6ad6b03](https://github.com/plebbit/plebones/commit/6ad6b03f5973a9cf3901a92c6622f4d8842e8f88))
* **reply-tools:** select text to quote ([78f195a](https://github.com/plebbit/plebones/commit/78f195aae5aa41a170c0fa6699096d8c9298afc2))


### Performance Improvements

* **hooks:** use entries instead of keys ([81f445c](https://github.com/plebbit/plebones/commit/81f445c1a7d7e5cc2718aa239d52aaeb621db32e))
* test increasing bottom viewport to see if it's less glitchy ([a4d1f35](https://github.com/plebbit/plebones/commit/a4d1f350198e5413ba76b318a7fc4281c16dc09b))



## [0.1.6](https://github.com/plebbit/plebones/compare/v0.1.5...v0.1.6) (2023-09-24)


### Bug Fixes

* **feed-post:** author address with dash wraps with float left ([8fac02e](https://github.com/plebbit/plebones/commit/8fac02ee557eabed834be422ab2c42dcdf81f935))
* **hooks:** don't set unread reply count on replies ([724695b](https://github.com/plebbit/plebones/commit/724695b013d525e32668b9e7c540e991cd7ee11d))
* **hooks:** fix new comments shouldnt show updating state ([9ea7969](https://github.com/plebbit/plebones/commit/9ea796941a364c823c6a62fd80c3a34af9985f9c))
* **hooks:** use client host instead of client url in resolving address state ([009e479](https://github.com/plebbit/plebones/commit/009e479c1bfed3e0817688c112d1c8e45e4879ce))
* **hooks:** use new states hooks so state strings show more accurately ([5eddebb](https://github.com/plebbit/plebones/commit/5eddebb5e822657856e6bea7361385791f802da3))
* **views:** use useAuthorAddress directly to expose the plebbit-js bug of comment.signature missing ([9efde05](https://github.com/plebbit/plebones/commit/9efde05e527f934e58e924c026c70880ac13eaf3))


### Features

* **menu:** translate about button on first visit post page ([29dc6e8](https://github.com/plebbit/plebones/commit/29dc6e8459a8a571eb585d82ecf7de290dc43743))
* **settings:** force keep the same account id to make it possible to copy paste from other clients ([e8342d0](https://github.com/plebbit/plebones/commit/e8342d0b7b0d6c9ca348aa77d90b7397ff89cb7d))



## [0.1.5](https://github.com/plebbit/plebones/compare/v0.1.4...v0.1.5) (2023-09-17)


### Features

* **menu:** scroll to top button is now visible if you hover bottom right corner ([fcf6052](https://github.com/plebbit/plebones/commit/fcf60522cbbb37ae54f345a8796fa5393f6d1ace))


### Reverts

* dont all changelog to release, doesn't work ([71d2b76](https://github.com/plebbit/plebones/commit/71d2b7650425dab80e0e45f63db921408e3bc191))
* revert version ([b125ecc](https://github.com/plebbit/plebones/commit/b125ecc8139b84b29a0d348c377ee2c947e0014e))



## [0.1.4](https://github.com/plebbit/plebones/compare/v0.1.3...v0.1.4) (2023-09-16)



## [0.1.3](https://github.com/plebbit/plebones/compare/v0.1.2...v0.1.3) (2023-08-29)



## [0.1.2](https://github.com/plebbit/plebones/compare/v0.1.1...v0.1.2) (2023-08-25)



## [0.1.1](https://github.com/plebbit/plebones/compare/v0.1.0...v0.1.1) (2023-08-20)



# 0.1.0 (2023-08-19)



