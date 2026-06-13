# Human-style section
def calc_total(items):
    total = 0
    for i in items:
        total += i["price"]
    return total


# AI-style section
def calculate_average(values):
    """
    Calculate the arithmetic mean of a list of numbers.
    Returns 0 when the list is empty.
    """
    if not values:
        return 0

    return sum(values) / len(values)


# Human-style section
def get_user_name(user):
    if "name" in user:
        return user["name"]
    return "Unknown"


# AI-style section
class ValidationError(Exception):
    """Raised when validation fails."""
    pass