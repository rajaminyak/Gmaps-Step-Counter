// popup.js
document.addEventListener('DOMContentLoaded', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {action: "getDistance"}, function(response) {
        if (response && response.distance) {
          document.getElementById('distanceInfo').textContent = `Route distance: ${response.distance}`;
        }
      });
    });
  
    document.getElementById('calculate').addEventListener('click', function() {
      const height = document.getElementById('height').value;
      const weight = document.getElementById('weight').value;
      const gender = document.getElementById('gender').value;
      const walkingType = document.getElementById('walkingType').value;
      const distanceText = document.getElementById('distanceInfo').textContent;
      const distance = parseFloat(distanceText.match(/\d+(\.\d+)?/)[0]);
  
      const results = calculateStepsAndCalories(distance, height, weight, gender, walkingType);
      document.getElementById('results').innerHTML = `
        <p>Estimated Steps: ${results.steps}</p>
        <p>Estimated Calories: ${results.calories}</p>
        <p>Estimated Time: ${results.time} minutes</p>
      `;
    });
  });
  
  function calculateStepsAndCalories(distance, height, weight, gender, walkingType) {
    let stepLength = (gender === 'male' ? 0.415 : 0.413) * (parseFloat(height) / 100);
  
    const walkingFactors = {
      'leisurely': { stepMod: 0.9, metsValue: 2.5, speed: 3 },
      'moderate': { stepMod: 1.0, metsValue: 3.5, speed: 4.5 },
      'brisk': { stepMod: 1.1, metsValue: 4.5, speed: 6 }
    };
  
    const factor = walkingFactors[walkingType];
    stepLength *= factor.stepMod;
  
    const distanceMeters = distance * 1000;
    const estimatedSteps = Math.round(distanceMeters / stepLength);
  
    const weightKg = parseFloat(weight);
    const durationHours = distanceMeters / (factor.speed * 1000);
    const caloriesBurned = Math.round(factor.metsValue * weightKg * durationHours);
  
    const timeMinutes = Math.round((durationHours * 60) * 10) / 10;
  
    return { steps: estimatedSteps, calories: caloriesBurned, time: timeMinutes };
  }
  