import random

#  performance database
performance_DB = {
    "easy": [
        { 
            "type": "squat", 
            "exercise": "Do 3 sets of 15 squats",
            "tips": "Keep your chest up and back straight",
        },
        { 
            "type": "running", 
            "exercise": "Run for 10 minutes without stopping",
            "tips": "Focus on breathing: in through the nose, out through the mouth",
        },
        { 
            "type": "pushUps", 
            "exercise": "Complete 3 sets of 10 push-ups",
            "tips": "Keep body in a straight line (don’t sag!)",
        },
        { 
            "type": "bicepsCurl", 
            "exercise": "Do 3 sets of 12 curls (use dumbbells, bands, or even water bottles)",
            "tips": "Don’t swing your arms — keep your elbows close to your torso",
        },
        { 
            "type": "plank", 
            "exercise": "Hold a standard plank for 60 seconds",
            "tips": "Keep a straight line from shoulders to ankles",
        },
    ],
    "medium": [
        {
            "type": "squat",
            "exercise": "4 sets of 20 squats (bodyweight or goblet-style). Try jump squats: 3 sets of 10 reps",
            "tips": "Push through heels as you come up"
        },
        {
            "type": "running",
            "exercise": "Run 2–3 km non-stop at a steady pace. Try interval training: 1 min sprint, 1 min jog (6 rounds)",
            "tips": "Incorporate breathing rhythm: 2 steps inhale, 2 steps exhale"
        },
        {
            "type": "pushUps",
            "exercise": "4 sets of 15 full push-ups. Add slow tempo push-ups (3 sec down, 1 sec up)",
            "tips": "Don’t flare elbows too wide — keep them at 45° angle"
        },
        {
            "type": "bicepsCurl",
            "exercise": "3 sets of 15 reps with moderate weight. Try concentration curls or hammer curls",
            "tips": "Control both upward and downward motion"
        },
        {
            "type": "planks",
            "exercise": "Hold forearm plank for 90 seconds. Side plank with hip dips – 30s per side x 2 rounds",
            "tips": "Press through forearms and squeeze glutes. Breathe deeply — don’t hold your breath"
        },
    ],
    "hard": [
        {
            "type": "squat",
            "exercise": "5 sets of 20 weighted squats (use dumbbells/barbell/backpack). 4 sets of jump squats to failure (max reps). 3 rounds of squat + hold (15 squats + 20s hold)",
            "tips": "Go below parallel (ass-to-grass depth if form allows). Keep chest up, spine neutral even with weight"
        },
        {
            "type": "running",
            "exercise": "Run 5–7 km at strong pace. Sprint intervals: 45 sec sprint, 1 min jog (10 rounds). Fartlek run: 30 min alternating between fast and slow paces",
            "tips": "Mix in elevation/hill sprints for added intensity. Track heart rate to stay in performance zone (e.g., 80–90% max)"
        },
        {
            "type": "pushUps",
            "exercise": "5 sets of 20–25 strict push-ups. Add variations: archer push-ups, clapping push-ups, pseudo-planche. Do push-up ladder: 1 → 10 reps, no break (55 total reps)",
            "tips": "Maintain tight plank posture throughout. Use a metronome tempo (e.g., 3s down, 1s up) for difficulty"
        },
        {
            "type": "bicepsCurl",
            "exercise": "4 sets of 12 reps using heavy dumbbells (max effort). Do slow negatives: 2s up, 4s down. Superset with pull-ups or resistance band curls",
            "tips": "Add drop sets: reduce weight mid-set and continue curling. Use a full range of motion — full extension to contraction"
        },
        {
            "type": "plank",
            "exercise": "Hold plank for 2–3 minutes. Add weighted plank (plate or weight on back). Perform dynamic planks: plank to push-up, side planks with leg raise",
            "tips": "Engage everything: abs, glutes, legs, shoulders. Mix in stability tools ( stability ball ) for advanced core control"
        },
    ],
}

def recommend_tasks(level):
    print(level)
    suggestions = performance_DB.get(level.lower())
    print(suggestions)
    if suggestions:
        return random.sample(suggestions, 1)  # Recommend 1 random suggestions
    return []