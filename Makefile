SHELL = /bin/bash
PRE-COMMIT := $(shell which pre-commit)

.PHONY: all
all: run

.PHONY: run
run: project area

.PHONY: project
project:
	./project-compare

.PHONY: area
area:
	./area-compare

# Shortcut to run pre-commit hooks over the entire repo.
.PHONY: pre-commit
pre-commit: .git/hooks/pre-commit
	pre-commit run --all-files

# Update the pre-commit hooks if the pre-commit binary is updated.
.git/hooks/pre-commit: $(PRE-COMMIT)
	pre-commit install

.PHONY: clean
clean:
	rm -f .*.stamp
