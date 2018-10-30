.DEFAULT_GOAL: help
PROJECT_NAME := hubot-multilang

.PHONY: help
help: ## Show this help
	@echo "Makefile for ${PROJECT_NAME}\n"
	@fgrep -h "##" $(MAKEFILE_LIST) | \
	fgrep -v fgrep | sed -e 's/## */##/' | column -t -s##

.PHONY: build
build: ## Compile and install the purescript files
build: lang/purescript/dist/bundle.js

.PHONY: clean
clean: ## Remove generated files
	@rm lang/purescript/dist/bundle.js

.PHONY: docker-redis
docker-redis: ## Run a Redis container mapped to port 16379
	@docker run -d -p 16379:6379 --name hubot-brain redis:5.0.0

.PHONY: alonzo
alonzo: ## Start alonzo
alonzo: BOT=alonzo
alonzo: start

.PHONY: start
start:
	cd ${BOT}; ./bin/hubot

lang/purescript/dist/bundle.js:
	@cd lang/purescript; \
	pulp browserify -O --skip-entry-point --standalone bundle \
						--main Bot --to ./dist/bundle.js


