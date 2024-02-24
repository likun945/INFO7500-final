function distance(p1, p2) {
    return Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2);
}

function isSquare(points) {
    const distances = [];

    for (let i = 0; i < 4; i++) {
        for (let j = i + 1; j < 4; j++) {
            distances.push(distance(points[i], points[j]));
        }
    }

    distances.sort((a, b) => a - b);

    return (distances[0] === distances[1]) && (distances[1] === distances[2]) && (distances[2] === distances[3]) && (distances[4] === distances[5]);
}

function checkCombinations(points, currentCombo, start) {
    if (currentCombo.length === 4) {
        return isSquare(currentCombo);
    }

    for (let i = start; i < points.length; i++) {
        currentCombo.push(points[i]);
        if (checkCombinations(points, currentCombo, i + 1)) {
            return true;
        }
        currentCombo.pop();
    }

    return false;
}

function containsSquare(points) {
    return checkCombinations(points, [], 0);
}

// Test
const points = [[0, 0], [2, 0], [1, 1], [0, -1], [-1, -1], [0, 2], [0, 1], [1, 0]];
console.log(containsSquare(points)); // true
