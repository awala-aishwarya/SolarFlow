
import math


# DEMO PRICING CONFIGURATION
# Replace with verified installer prices before real-world use.

PRICE_PER_KW = 60000

GENERATION_PER_KW = 1400

ELECTRICITY_RATE_PER_UNIT = 8

# Illustrative subsidy rules from the assignment
SUBSIDY_FIRST_TWO_KW = 30000
SUBSIDY_THIRD_KW = 18000
MAX_SUBSIDY = 78000


def calculate_subsidy(system_capacity):
    """
    Calculate illustrative residential subsidy.
    """

    if system_capacity <= 0:
        return 0

    first_two_kw = min(system_capacity, 2)

    subsidy = first_two_kw * SUBSIDY_FIRST_TWO_KW

    if system_capacity > 2:
        third_kw = min(system_capacity - 2, 1)
        subsidy += third_kw * SUBSIDY_THIRD_KW

    return min(subsidy, MAX_SUBSIDY)


def generate_quote(system_capacity, electricity_rate=None):
    """
    Generate solar installation quotation.
    """

    if system_capacity <= 0:
        raise ValueError("System capacity must be greater than zero")

    if electricity_rate is None:
        electricity_rate = ELECTRICITY_RATE_PER_UNIT

    if electricity_rate <= 0:
        raise ValueError("Electricity rate must be greater than zero")

    # Annual electricity generation
    annual_generation = (
        system_capacity * GENERATION_PER_KW
    )

    # Estimated installation cost
    installation_cost = (
        system_capacity * PRICE_PER_KW
    )

    # Government subsidy
    subsidy = calculate_subsidy(system_capacity)

    # Net installation cost
    net_cost = max(
        installation_cost - subsidy,
        0
    )

    # Estimated annual savings
    annual_savings = (
        annual_generation * electricity_rate
    )

    # Payback period
    if annual_savings > 0:
        payback_years = net_cost / annual_savings
    else:
        payback_years = None

    return {
        "system_capacity_kw": system_capacity,
        "annual_generation_units": annual_generation,
        "installation_cost": installation_cost,
        "estimated_subsidy": subsidy,
        "net_installation_cost": net_cost,
        "electricity_rate_per_unit": electricity_rate,
        "estimated_annual_savings": round(annual_savings, 2),
        "estimated_payback_years": (
            round(payback_years, 2)
            if payback_years is not None
            else None
        ),
        "pricing_note": (
            "Illustrative demo pricing. "
            "Actual installer quotation may vary."
        )
    }
