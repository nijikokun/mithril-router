#
# Run all tests
#
test:
	@@node_modules/.bin/istanbul cover node_modules/.bin/_mocha -- -u exports -R spec test/*

.PHONY: test