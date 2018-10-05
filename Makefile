.DEFAULT_GOAL: help
PROJECT_NAME := hubot-purescript

.PHONY: help
help: ## Show this help
	@echo "Makefile for ${PROJECT_NAME}\n"
	@fgrep -h "##" $(MAKEFILE_LIST) | \
	fgrep -v fgrep | sed -e 's/## */##/' | column -t -s##


.PHONY: install
build: ./purescript/dist/bundle.js
build: ## Compile and install the purescript files

.PHONY: clean
clean:
	rm purescript/dist/bundle.js


.PHONY: start
start: ## Start the hubot
start:
	cd hubot; ./bin/hubot

./purescript/dist/bundle.js:
	cd purescript; \
	pulp browserify -O --skip-entry-point --standalone bundle \
					--main Bot --to ./dist/bundle.js




