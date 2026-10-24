.DEFAULT_GOAL := help

.PHONY: help deps check fix test

# ==============================================================================
# Colors
# ==============================================================================

GREEN := \033[0;32m
BLUE  := \033[0;34m
CYAN  := \033[0;36m
NC    := \033[0m

# ==============================================================================
# Help
# ==============================================================================

help: ## Show this help message
	@grep -E '^[a-zA-Z0-9_-]+:.*##@' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*##@"} { \
			n = index($$2, " "); \
			group = substr($$2, 1, n - 1); \
			desc = substr($$2, n + 1); \
			if (group != last) { if (last) printf "\n"; last = group; printf "$(CYAN)%s$(NC)\n", group } \
			printf "  $(GREEN)%-10s$(NC) %s\n", $$1, desc \
		}'

# ==============================================================================
# Setup
# ==============================================================================

deps: ##@Setup Install dependencies
	@echo "$(BLUE)Installing dependencies...$(NC)"
	@pnpm install
	@echo ""
	@echo "$(GREEN)✓ Dependencies installed$(NC)"

# ==============================================================================
# Quality
# ==============================================================================

check: ##@Quality Check formatting, linting, types and the mod's hooks
	@echo "$(BLUE)Checking...$(NC)"
	@pnpm biome
	@echo ""
	@echo "$(BLUE)Type-checking...$(NC)"
	@pnpm type-check
	@echo ""
	@echo "$(BLUE)Validating the mod...$(NC)"
	@claude plugin validate .
	@echo ""
	@echo "$(GREEN)✓ All checks passed$(NC)"

fix: ##@Quality Fix formatting and linting issues
	@echo "$(BLUE)Fixing...$(NC)"
	@pnpm biome:fix
	@echo ""
	@echo "$(GREEN)✓ All fixes applied$(NC)"

test: ##@Quality Run the mod's tests
	@echo "$(BLUE)Running tests...$(NC)"
	@pnpm test
	@echo ""
	@echo "$(GREEN)✓ Tests passed$(NC)"
