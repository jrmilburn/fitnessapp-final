import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

//Recovery factor is applied when generating new set volumes
//A recovery factor of 1 does not apply additional volume easily
//A decrease in recovery factor decreases how much volume is applied

async function main() {

const muscleGroups = await prisma.muscleGroup.createMany({
    data: [
      { id: 'Quads', name: 'Quads',   recoveryFactor: 1 },
      { id: 'Hamstrings', name: 'Hamstrings',   recoveryFactor: 0.75 },
      { id: 'Calves', name: 'Calves',   recoveryFactor: 1.5 },
      { id: 'Glutes', name: 'Glutes',   recoveryFactor: 0.75 },
      { id: 'Abs', name: 'Abs',   recoveryFactor: 1 },
      { id: 'Back', name: 'Back',   recoveryFactor: 1 },
      { id: 'Chest', name: 'Chest',   recoveryFactor: 1 },
      { id: 'Shoulders', name: 'Shoulders',   recoveryFactor: 1 },
      { id: 'Biceps', name: 'Biceps',   recoveryFactor: 1 },
      { id: 'Triceps', name: 'Triceps',   recoveryFactor: 1 },
    ],
  });

  const exercises = await prisma.exerciseTemplate.createMany({
    data: [
      {
        name: "Barbell Clean",
        shortDescription: "",
        description: `Muscles Worked: Quadriceps, Gluteus Maximus, Hamstrings, Erector Spinae, Trapezius, Deltoids

Description:
Start with feet hip-width apart, bar over midfoot, and grip just outside the knees. Begin with a controlled pull from the floor, extending through the hips and knees explosively. Once the bar passes mid-thigh, aggressively extend the hips and shrug, pulling yourself under the bar into a front rack position. Stand tall to finish the lift.

Coaching Cues:
"Push through the floor, don’t yank the bar."
"Keep the bar close through the pull."
"Extend hips fully, then pull under."
"Elbows fast through to the front rack."`,
        videoUrl: "https://www.youtube.com/watch?v=7glUUsAWu9Y",
        isPublic: true,
        muscleGroupId: "Hamstrings",
        createdByUserId: null,
        
      },
      {
        name: "Barbell Back Squat",
        shortDescription: "A compound lower-body exercise where you squat with a barbell on your back, primarily working the quadriceps and glutes.",
        description: `Muscles Worked: Quadriceps, Glutes, Hamstrings (also engages core for stability).

Steps:
1. Position a barbell on your upper back (trapezius) and stand with feet about shoulder-width apart, toes slightly turned outward.
2. Keep your chest up and core braced, then bend your knees and hips to lower into a squat until your thighs are at least parallel to the floor.
3. Drive through your heels to extend your hips and knees, returning to a standing position.

Coaching Cues:
- Keep your back straight and chest lifted throughout the movement.
- Do not let your knees cave inward; keep them tracking in line with your toes.
- Maintain your weight on your heels and mid-foot (keep heels down) as you push up.
- Engage your core and avoid leaning too far forward when squatting.`,
        videoUrl: "https://www.youtube.com/watch?v=-bJIpOq-LWk",
        isPublic: true,
        muscleGroupId: "Quads",
        createdByUserId: null
      },
      {
        name: "Barbell Front Squat",
        shortDescription: "A barbell squat variation with the barbell held in front of the shoulders, emphasizing the quadriceps and core.",
        description: `Muscles Worked: Quadriceps, Glutes, Hamstrings (with a strong focus on quads and core).

Steps:
1. Rack the barbell at the front of your shoulders, arms crossed or fingertips under the bar for support, keeping elbows pointed forward and high.
2. Stand with feet shoulder-width apart, toes slightly outward. Keeping your torso upright, bend at the knees and hips to lower into a squat, allowing your elbows to remain elevated.
3. Descend until your thighs are parallel to the floor (or as low as comfortable with good form).
4. Push through your heels to stand back up, keeping your chest up and elbows high throughout.

Coaching Cues:
- Keep your elbows up to prevent the bar from rolling forward off your shoulders.
- Maintain an upright torso and tight core to support the weight.
- Don't let your knees collapse inward; ensure they track over your toes.
- Avoid rounding your lower back at the bottom of the squat.`,
        videoUrl: "https://www.youtube.com/watch?v=oHCApwG5OZY",
        isPublic: true,
        muscleGroupId: "Quads",
        createdByUserId: null
      },
      {
        name: "Barbell Deadlift",
        shortDescription: "A fundamental barbell lift where you pull a weight from the floor to a standing position, engaging the hamstrings, glutes, and back.",
        description: `Muscles Worked: Hamstrings, Glutes, Lower Back (also engages quads and upper back).

Steps:
1. Stand with your mid-foot under the barbell, feet hip-width apart. Bend at your hips and knees to grasp the bar just outside your legs (overhand or mixed grip).
2. Flatten your back and lift your chest, ensuring your shoulders are above or slightly in front of the bar and your core is braced.
3. Drive through your heels and extend your hips and knees to lift the bar, keeping it close to your body. Stand up straight as the bar passes your knees, bringing your hips forward.
4. Squeeze your glutes at the top with your hips locked out. Then hinge at the hips and bend your knees to lower the bar back to the floor under control.

Coaching Cues:
- Keep your back neutral (flat) and core engaged to protect your spine.
- Push the floor away with your legs and keep the bar close to your shins to maintain good leverage.
- Do not jerk the bar off the ground; build tension first, then lift smoothly.
- At the top, avoid leaning back excessively; stand tall with shoulders down and hips through.`,
        videoUrl: "https://www.youtube.com/watch?v=3UwO0fKukRw",
        isPublic: true,
        muscleGroupId: "Hamstrings",
        createdByUserId: null
      },
      {
        name: "Barbell Romanian Deadlift",
        shortDescription: "A deadlift variation focusing on the hamstrings and glutes, performed by lowering a barbell from hip height with minimal knee bend.",
        description: `Muscles Worked: Hamstrings, Glutes (also engages lower back).

Steps:
1. Start standing upright holding a barbell in front of you at hip level with an overhand grip, hands about shoulder-width apart.
2. With a slight bend in your knees, hinge at your hips by pushing your butt backward. Keep your back flat and shoulders pulled back as you lower the bar down along your thighs.
3. Lower the bar until you feel a stretch in your hamstrings (typically when your torso is nearly parallel to the ground), keeping the bar close to your legs and your back neutral.
4. Drive your hips forward and contract your hamstrings and glutes to raise your torso back up to standing, lifting the bar back to the starting position.

Coaching Cues:
- Maintain a flat back and engaged core throughout the movement; avoid rounding your spine.
- The movement is a hip hinge, not a squat—your knees stay slightly bent but relatively fixed.
- Keep the barbell close to your body to reduce strain on your lower back.
- Only lower as far as you can while maintaining proper form and hamstring tension, then squeeze your glutes to return up.`,
        videoUrl: "https://www.youtube.com/watch?v=xgusDooVfKU",
        isPublic: true,
        muscleGroupId: "Hamstrings",
        createdByUserId: null
      },
      {
        name: "Barbell Sumo Deadlift",
        shortDescription: "A deadlift variation with a wide stance and hands inside the knees, emphasizing the glutes and inner thighs along with the hamstrings.",
        description: `Muscles Worked: Glutes, Hamstrings, Quads, Inner Thighs (adductors), Lower Back.

Steps:
1. Stand with a wide stance (feet wider than shoulder-width) and toes pointed outward. Position the bar over mid-foot and grasp it with hands inside your knees (arms vertical), using an overhand or mixed grip.
2. Drop your hips and bend your knees, keeping your chest up and back straight, until you can grip the bar firmly. Your shoulders should be slightly in front of the bar.
3. Push through your heels and squeeze your glutes to lift the bar, extending your knees and hips. Keep your knees pushed out (tracking over toes) and the bar close to your body as you rise.
4. Stand fully upright at the top, hips locked out. Then lower the bar back down by hinging at the hips and bending the knees, keeping your back flat as you return the weight to the floor.

Coaching Cues:
- Use a wide stance and focus on pushing your knees outward during the lift to engage your glutes.
- Keep your chest up and core tight to maintain a neutral spine throughout the movement.
- Drive through your heels and mid-foot; avoid rising onto your toes.
- At lockout, squeeze your glutes and avoid leaning back. Maintain control when lowering the bar.`,
        videoUrl: "https://www.youtube.com/watch?v=EvXiYXKdXe0",
        isPublic: true,
        muscleGroupId: "Glutes",
        createdByUserId: null
      },
      {
        name: "Barbell Bench Press",
        shortDescription: "A classic upper-body compound exercise pressing a barbell from the chest, primarily targeting the chest muscles, along with the shoulders and triceps.",
        description: `Muscles Worked: Chest (Pectorals), Shoulders (Anterior Deltoids), Triceps.

Steps:
1. Lie flat on a bench with your eyes under the racked bar. Plant your feet firmly on the floor. Grasp the barbell with hands slightly wider than shoulder-width apart.
2. Unrack the bar and hold it above your chest with arms extended. Keep your shoulder blades pinched together and down on the bench.
3. Lower the barbell toward the mid-chest by bending your elbows, keeping them at about a 45-degree angle from your body (not flared straight out).
4. Lightly touch the bar to your chest, then press the bar back up by extending your arms, driving through your chest and triceps, until your arms are straight.

Coaching Cues:
- Keep your shoulder blades retracted (pulled back and down) to create a stable base and protect your shoulders.
- Maintain a slight arch in your lower back and keep your feet pressed into the floor for stability (leg drive).
- Control the descent of the bar; avoid bouncing it off your chest.
- Exhale as you press up and lock out without overextending or lifting your shoulders off the bench.`,
        videoUrl: "https://www.youtube.com/watch?v=CayG6UYqL8g",
        isPublic: true,
        muscleGroupId: "Chest",
        createdByUserId: null
      },
      {
        name: "Barbell Incline Bench Press",
        shortDescription: "A barbell press performed on an incline bench to target the upper chest, with secondary work on shoulders and triceps.",
        description: `Muscles Worked: Upper Chest (Clavicular pectorals), Shoulders (Anterior Delts), Triceps.

Steps:
1. Lie on an incline bench (30-45° angle) and grasp the barbell with a grip slightly wider than shoulder-width.
2. Unrack the bar and stabilize it above your upper chest.
3. Lower the barbell to your chest (around the upper chest/clavicle area) while keeping elbows angled out slightly.
4. Press the bar upward until arms are extended, focusing on squeezing your chest at the top.

Coaching Cues:
- Maintain your shoulder blades retracted on the bench for stability and shoulder safety.
- Lower the bar with control; don't bounce it off your chest.
- Keep your wrists straight and directly above your elbows throughout the movement.
- Exhale as you press and avoid locking out elbows harshly.`,
        videoUrl: "https://www.youtube.com/watch?v=2jFFCy8JBU8",
        isPublic: true,
        muscleGroupId: "Chest",
        createdByUserId: null
      },
      {
        name: "Barbell Decline Bench Press",
        shortDescription: "A barbell press on a decline bench, emphasizing the lower chest muscles while also engaging the shoulders and triceps.",
        description: `Muscles Worked: Chest (lower), Shoulders, Triceps.

Steps:
1. Lie on a decline bench (head lower than hips) and grip the bar slightly wider than shoulder-width.
2. Unrack the barbell and position it over your lower chest.
3. Lower the bar to touch your lower chest/upper abdomen, keeping elbows slightly tucked.
4. Press the bar back up until arms are straight, focusing on contracting your chest.

Coaching Cues:
- Keep your body secure and core engaged since the decline angle can shift your balance.
- Use a spotter for safety when handling heavy weight on decline.
- Control the bar on the way down; maintain a steady tempo.
- Keep shoulders back against the bench and avoid shrugging them during the press.`,
        videoUrl: "https://www.youtube.com/watch?v=zYBA82m9P9U",
        isPublic: true,
        muscleGroupId: "Chest",
        createdByUserId: null
      },
      {
        name: "Barbell Overhead Press",
        shortDescription: "A compound upper-body exercise where you press a barbell overhead from shoulder level, targeting the shoulders and triceps.",
        description: `Muscles Worked: Shoulders (deltoids), Triceps, upper chest a bit, traps as stabilizer perhaps.

Steps:
1. Stand with your feet shoulder-width apart, holding a barbell at shoulder level with hands just outside shoulder width (palms forward).
2. Brace your core and press the barbell straight up overhead until your arms are fully extended.
3. Pause briefly at the top, ensuring the bar is balanced over the middle of your foot (with head slightly forward under the bar).
4. Lower the bar under control back to your shoulders.

Coaching Cues:
- Keep your core tight and glutes squeezed to avoid arching your lower back.
- Press the bar overhead in a straight path; move your head slightly back and then forward once the bar passes your face.
- Do not flare your ribs; maintain a neutral spine.
- Lock out with your arms straight and ears in line with your arms at the top.`,
        videoUrl: "https://www.youtube.com/watch?v=Si73_a6qoQE",
        isPublic: true,
        muscleGroupId: "Shoulders",
        createdByUserId: null
      },
      {
        name: "Barbell Bent-Over Row",
        shortDescription: "A barbell exercise pulling weight to your torso while bent over at the hips, working the back musculature and biceps.",
        description: `Muscles Worked: Back (latissimus dorsi, rhomboids, trapezius), Biceps, rear shoulders.

Steps:
1. Stand with feet hip-width apart holding a barbell with an overhand grip, hands about shoulder-width. Slightly bend your knees.
2. Hinge at the hips to lean forward, keeping your back flat, until your torso is roughly parallel to the ground.
3. Let the bar hang at arm's length, then pull it toward your lower chest/upper abdomen by driving your elbows back.
4. Squeeze your back muscles at the top of the movement, then lower the bar back down with control.

Coaching Cues:
- Keep your back flat and core braced; avoid rounding your spine.
- Lead the pull with your elbows, keeping them close to your body.
- Do not jerk the weight; use controlled movement and avoid using momentum.
- Keep your neck neutral by looking a few feet ahead of you on the floor.`,
        videoUrl: "https://www.youtube.com/watch?v=6FZHJGzMFEc",
        isPublic: true,
        muscleGroupId: "Back",
        createdByUserId: null
      },
      {
        name: "Barbell Upright Row",
        shortDescription: "An upper-body exercise pulling a barbell vertically to chest height, targeting the shoulders (especially lateral delts) and trapezius.",
        description: `Muscles Worked: Shoulders (deltoids, especially lateral), Traps, Biceps somewhat.

Steps:
1. Stand with feet hip-width and hold a barbell with an overhand grip, hands about shoulder-width or slightly narrower, resting it in front of your thighs.
2. Keeping the bar close to your body, lift your elbows up and to the sides to raise the barbell toward your chest.
3. Stop when the bar reaches chest level (elbows around shoulder height).
4. Lower the bar back down slowly to the starting position.

Coaching Cues:
- Lead with your elbows and keep them above the wrists throughout the lift.
- Keep the bar close to your body; do not swing it outwards.
- Maintain an upright posture and avoid leaning back or using momentum.
- If you feel shoulder discomfort, reduce range or weight as upright rows can stress the shoulders for some individuals.`,
        videoUrl: "https://www.youtube.com/watch?v=amCU-ziHITM",
        isPublic: true,
        muscleGroupId: "Shoulders",
        createdByUserId: null
      },
      {
        name: "Barbell Lunge",
        shortDescription: "A lower-body exercise where you step forward into a lunge with a barbell on your back, engaging the quadriceps and glutes.",
        description: `Muscles Worked: Quadriceps, Glutes, Hamstrings.

Steps:
1. Place a barbell on your upper back (as you would for a squat) and stand upright with feet shoulder-width apart.
2. Step forward with one leg, landing on the heel, and bend both knees to lower into a lunge until the front thigh is about parallel to the ground and back knee nearly touches the floor.
3. Push through the heel of your front foot to raise yourself back up to standing, bringing the front foot back to the starting position.
4. Repeat on the other leg (if doing alternating lunges) or complete all reps on one leg before switching.

Coaching Cues:
- Keep your torso upright and core engaged throughout the lunge.
- Take a big enough step forward such that your front knee stays roughly above your ankle, not pushed past toes.
- Do not allow your front knee to cave inward; keep it in line with your toes.
- Maintain your weight on the front heel as you push back up to stand.`,
        videoUrl: "https://www.youtube.com/watch?v=ci4rsmlOk24",
        isPublic: true,
        muscleGroupId: "Quads",
        createdByUserId: null
      },
      {
        name: "Barbell Bulgarian Split Squat",
        shortDescription: "A challenging single-leg squat variation performed with a barbell, with the back foot elevated, primarily targeting the quads and glutes.",
        description: `Muscles Worked: Glutes, Quads, Hamstrings.

Steps:
1. Stand lunge-length in front of a bench, holding a barbell on your upper back. Place the top of one foot on the bench behind you.
2. Keeping your torso upright, bend your front knee to lower your body. Drop straight down, allowing your back knee to move toward the ground.
3. Descend until your front thigh is parallel to the floor (or as far as comfortable), making sure your front knee does not travel too far past your toes.
4. Press through your front heel to raise back up to the starting position. Complete all reps on one side before switching legs.

Coaching Cues:
- Focus on keeping your weight through the heel of the front foot for better glute activation.
- Maintain an upright chest and tight core for balance and stability.
- Avoid allowing your front knee to cave inward; keep it tracking over your foot.
- Use a controlled motion; avoid bouncing at the bottom of the movement.`,
        videoUrl: "https://www.youtube.com/watch?v=058MAmOH1Xk",
        isPublic: true,
        muscleGroupId: "Glutes",
        createdByUserId: null
      },
      {
        name: "Barbell Hip Thrust",
        shortDescription: "A glute-focused exercise where you thrust your hips upward with a barbell resting on your hips, primarily targeting the glutes and hamstrings.",
        description: `Muscles Worked: Glutes, Hamstrings, (quads minor, but mainly glutes).

Steps:
1. Sit on the ground with your upper back against a bench and a barbell positioned across your hips (use padding for comfort).
2. Plant your feet flat on the floor, shoulder-width apart, with knees bent.
3. Drive through your heels to lift your hips up, extending them until your body forms a straight line from shoulders to knees. Squeeze your glutes at the top.
4. Lower your hips back down under control and repeat for reps.

Coaching Cues:
- Keep your chin tucked and eyes forward to help maintain a neutral spine.
- Drive through your heels and avoid pushing up with your toes.
- At the top, focus on squeezing the glutes and do not overextend your lower back.
- Use a padded bar cushion to avoid discomfort on the hips and ensure proper form through full range.`,
        videoUrl: "https://www.youtube.com/watch?v=Zp26q4BY5HE",
        isPublic: true,
        muscleGroupId: "Glutes",
        createdByUserId: null
      },
      {
        name: "Barbell Good Morning",
        shortDescription: "A posterior chain exercise where you hinge forward with a barbell on your back, targeting the hamstrings and lower back.",
        description: `Muscles Worked: Hamstrings, Glutes, Lower Back.

Steps:
1. Stand with feet shoulder-width apart and a barbell resting on your upper back as in a squat position.
2. Keep a slight bend in your knees and hinge at the hips, sending your butt back as you lower your torso forward.
3. Continue to lean forward (with back flat) until you feel a stretch in your hamstrings or your torso is near parallel to the floor.
4. Engage your hamstrings and glutes to reverse the motion, raising your torso back up to the starting position.

Coaching Cues:
- Keep your back neutral and core braced; avoid rounding your spine as you bend.
- Lead the movement with your hips moving backward rather than just bending at the waist.
- Keep a slight knee bend but do not turn it into a squat; the movement is a hinge, not a knee bend.
- Start with very light weight to master form since this exercise can stress the lower back if done incorrectly.`,
        videoUrl: "https://www.youtube.com/watch?v=nWyx81AfTos",
        isPublic: true,
        muscleGroupId: "Hamstrings",
        createdByUserId: null
      },
      {
        name: "Barbell Shrug",
        shortDescription: "An exercise where you lift (shrug) your shoulders upward with a barbell, targeting the trapezius muscles of the upper back.",
        description: `Muscles Worked: Traps (upper trapezius), shoulders (to a lesser extent).

Steps:
1. Stand upright holding a barbell in front of you at arm's length with hands about shoulder-width apart (overhand grip).
2. Keep your arms straight and shrug your shoulders upward as high as possible, as if trying to touch your shoulders to your ears.
3. Pause at the top of the contraction, then lower your shoulders back down to the starting position.
4. (Shrug is simple so 3 steps might suffice, but listing 4 for consistency maybe not needed.)

Coaching Cues:
- Keep your arms straight; the movement comes solely from raising your shoulders.
- Avoid rolling your shoulders; lift them straight up and down.
- Squeeze your traps at the top of the movement briefly.
- Maintain good posture with your head neutral and back straight while performing shrugs.`,
        videoUrl: "https://www.youtube.com/watch?v=9xGqgGFAtiM",
        isPublic: true,
        muscleGroupId: "Back",
        createdByUserId: null
      },
      {
        name: "Barbell Curl",
        shortDescription: "A biceps exercise where you curl a barbell upward toward your chest, isolating the biceps muscles of the upper arm.",
        description: `Muscles Worked: Biceps.

Steps:
1. Stand holding a barbell with an underhand grip, hands about shoulder-width apart, arms extended down.
2. Keeping your elbows close to your sides, curl the barbell up toward your chest by contracting your biceps.
3. Lift until your elbows are bent fully or just before the bar touches your front shoulders.
4. Slowly lower the bar back down to the starting position, fully extending your arms.

Coaching Cues:
- Keep your elbows pinned to your sides; do not let them swing forward.
- Avoid using momentum or swinging your body; keep the movement controlled.
- Squeeze the biceps at the top of the movement.
- Keep wrists straight (not bent back) to maintain good form and avoid strain.`,
        videoUrl: "https://www.youtube.com/watch?v=dDI8ClxRS04",
        isPublic: true,
        muscleGroupId: "Biceps",
        createdByUserId: null
      },
      {
        name: "Barbell Skull Crusher",
        shortDescription: "A triceps isolation exercise where you lower a barbell toward your forehead and extend it back up, targeting the triceps.",
        description: `Muscles Worked: Triceps.

Steps:
1. Lie on a flat bench holding a barbell (or EZ-bar) with arms extended above your chest, hands about shoulder-width apart.
2. Keeping your upper arms stationary and elbows pointed forward, bend your elbows to lower the barbell toward your forehead (or just above your head).
3. Stop when the bar is just above your forehead (elbows bent about 90 degrees).
4. Press the bar back up by extending your elbows, returning to the starting position.

Coaching Cues:
- Keep your upper arms perpendicular to the floor and fixed in place; only your forearms should move.
- Lower the bar under control to avoid hitting your head—hence the name, be careful.
- Focus on using the triceps to extend your arms; avoid flaring your elbows outward excessively.
- A slight incline on the bench can reduce elbow strain if needed (just a tip, but maybe skip since not needed in cues?).`,
        videoUrl: "https://www.youtube.com/watch?v=trVzEReByPg",
        isPublic: true,
        muscleGroupId: "Triceps",
        createdByUserId: null
      },
      {
        name: "Barbell Close-Grip Bench Press",
        shortDescription: "A bench press variation with hands closer together to emphasize the triceps, while still working the chest and shoulders.",
        description: `Muscles Worked: Triceps (primary), Chest (secondary), Shoulders.

Steps:
1. Lie on a flat bench and grip the barbell with a narrow grip (hands about shoulder-width or slightly closer, around 6-12 inches apart).
2. Unrack the bar and hold it above your chest, arms extended.
3. Lower the barbell to your lower chest/upper abdomen area, keeping your elbows tucked close to your sides.
4. Push the bar back up to full extension, concentrating on contracting your triceps to press the weight up.

Coaching Cues:
- Keep your elbows tucked in near your body to place more emphasis on the triceps.
- Use a secure but not overly narrow grip; wrists should stay aligned with forearms.
- Maintain controlled movement and avoid bouncing the bar off your chest.
- Keep your core engaged and shoulders retracted to maintain stability and form.`,
        videoUrl: "https://www.youtube.com/watch?v=a3s2tZZENGI",
        isPublic: true,
        muscleGroupId: "Triceps",
        createdByUserId: null
      },
      {
        name: "Barbell Standing Calf Raise",
        shortDescription: "A calf exercise performed by raising your heels off the ground while supporting a barbell on your shoulders, strengthening the calf muscles.",
        description: `Muscles Worked: Calves (gastrocnemius, soleus).

Steps:
1. Stand upright with a barbell on your upper back (like in a squat position) and the balls of your feet on a raised platform or step (heels hanging off).
2. Keeping your core tight and legs straight (or slightly unlocked knees), lower your heels down to stretch the calves.
3. Press through the balls of your feet to raise your heels as high as possible.
4. Squeeze your calves at the top, then lower your heels back down slowly to the stretch position.

Coaching Cues:
- Use a full range of motion: feel the stretch at the bottom and a strong contraction at the top.
- Keep movement controlled; avoid bouncing.
- If balance is an issue, perform in a rack or with support nearby for safety.
- Keep your knees only slightly bent and stationary; motion should come from ankle joints.`,
        videoUrl: "https://www.youtube.com/watch?v=3UWi44yN-wM",
        isPublic: true,
        muscleGroupId: "Calves",
        createdByUserId: null
      },
      {
        name: "Dumbbell Goblet Squat",
        shortDescription: "A squat performed holding a dumbbell at chest level (goblet position), targeting the quads and glutes.",
        description: `Muscles Worked: Quadriceps, Glutes (also engages hamstrings and core).

Steps:
1. Stand with feet shoulder-width apart, holding a dumbbell vertically at chest level (hands cupping one end like a goblet).
2. Keeping your chest up and core tight, bend your knees and hips to sit back into a squat until your thighs are parallel to the floor (or slightly below).
3. Push through your heels to return to a standing position, keeping the dumbbell close to your chest throughout.
4. Repeat for the desired number of reps.

Coaching Cues:
- Keep your chest lifted and back flat; the dumbbell helps counterbalance to allow a deep squat.
- Make sure your knees track over your toes and do not cave inward.
- Go as low as your mobility allows while maintaining form and keeping heels down.
- Engage your core to support your spine as you squat and stand.`,
        videoUrl: "https://www.youtube.com/watch?v=Xjo_fY9Hl9w",
        isPublic: true,
        muscleGroupId: "Quads",
        createdByUserId: null
      },
      {
        name: "Dumbbell Lunge",
        shortDescription: "A lunge performed while holding dumbbells in each hand, working the quads, glutes, and hamstrings.",
        description: `Muscles Worked: Quads, Glutes, Hamstrings.

Steps:
1. Stand upright holding dumbbells at your sides, feet hip-width apart.
2. Step forward with one leg into a lunge, lowering until the front thigh is parallel to the floor and back knee near the ground.
3. Push through the front foot's heel to rise back up and step back to the starting position.
4. Repeat with the opposite leg or continue alternating.

Coaching Cues:
- Keep your torso upright and core engaged to maintain balance.
- Do not let your front knee travel beyond your toes or cave inward; step far enough forward for proper form.
- Keep the majority of weight in your front heel as you push back up.
- Use controlled movements; avoid slamming your knee to the ground.`,
        videoUrl: "https://www.youtube.com/watch?v=G4gAK8Bhyro",
        isPublic: true,
        muscleGroupId: "Quads",
        createdByUserId: null
      },
      {
        name: "Dumbbell Step-Up",
        shortDescription: "A compound leg exercise where you step up onto a platform holding dumbbells, targeting the quads and glutes.",
        description: `Muscles Worked: Glutes, Quads, Hamstrings.

Steps:
1. Hold a dumbbell in each hand at your sides and stand in front of a sturdy bench or step.
2. Place one foot entirely on the bench. Press through that heel to lift your body up onto the bench, bringing the trailing leg up as well (but not placing weight with trailing leg).
3. Step down carefully with the trailing leg under control, then the lead leg returns to the ground.
4. Repeat for the desired reps, either alternating legs or completing reps on one side then switching.

Coaching Cues:
- Focus on pushing through the heel of the foot on the step, rather than launching off the back leg.
- Keep your torso upright and avoid using momentum (no jumping off the back leg).
- The entire sole of your lead foot should be on the step to ensure good balance and knee alignment.
- Choose a step height that allows a 90-degree bend in the knee or slightly higher for a greater glute emphasis.`,
        videoUrl: "https://www.youtube.com/watch?v=9ZknEYboBOQ",
        isPublic: true,
        muscleGroupId: "Glutes",
        createdByUserId: null
      },
      {
        name: "Dumbbell Romanian Deadlift",
        shortDescription: "A dumbbell variation of the Romanian deadlift focusing on the hamstrings and glutes by hinging at the hips with minimal knee bend.",
        description: `Muscles Worked: Hamstrings, Glutes (also engages lower back).

Steps:
1. Stand with feet hip-width apart, holding a pair of dumbbells in front of your thighs, palms facing your body.
2. Maintain a slight bend in your knees and hinge at the hips, pushing your butt back as you lower the dumbbells along the front of your legs.
3. Lower until you feel a good stretch in your hamstrings (torso nearly parallel to ground), keeping your back flat and dumbbells close to your body.
4. Contract your hamstrings and glutes to extend your hips and return to standing, pulling the dumbbells back up along your legs.

Coaching Cues:
- Keep your back straight and core tight throughout the movement.
- Do not lock your knees; keep a slight bend but let most movement come from the hip hinge.
- Dumbbells should remain close to your legs to maintain balance and proper form.
- Avoid rounding your lower back; only go as low as you can while keeping a flat back and hamstring tension.`,
        videoUrl: "https://www.youtube.com/watch?v=aa57T45iFSE",
        isPublic: true,
        muscleGroupId: "Hamstrings",
        createdByUserId: null
      },
      {
        name: "Dumbbell Bench Press",
        shortDescription: "A chest press performed lying on a bench with dumbbells, allowing a greater range of motion while working the chest, shoulders, and triceps.",
        description: `Muscles Worked: Chest, Shoulders, Triceps.

Steps:
1. Lie on a flat bench with a dumbbell in each hand, held at shoulder level with palms facing forward. Keep your feet flat on the floor.
2. Press the dumbbells upward, extending your arms until they are straight above your chest. The dumbbells may come together at the top.
3. Pause briefly at the top, then lower the dumbbells under control back to the starting position at chest level.
4. Repeat for the desired number of reps.

Coaching Cues:
- Keep your elbows at an angle of about 45° to your body as you press (not flared out straight to the sides).
- Squeeze your chest at the top of the movement, but don't bang the dumbbells together.
- Maintain a stable base by keeping your shoulder blades retracted and down on the bench, and feet planted.
- Control the descent of the weights to avoid straining your shoulders.`,
        videoUrl: "https://www.youtube.com/watch?v=X3YrlBmjWrY",
        isPublic: true,
        muscleGroupId: "Chest",
        createdByUserId: null
      },
      {
        name: "Dumbbell Incline Bench Press",
        shortDescription: "A chest press on an incline bench using dumbbells to target the upper chest, with secondary involvement of shoulders and triceps.",
        description: `Muscles Worked: Chest (upper), Shoulders, Triceps.

Steps:
1. Set an incline bench to 30-45 degrees and lie back holding dumbbells at shoulder height, palms facing forward.
2. Press the dumbbells upward over your chest until your arms are extended, bringing the weights together above you.
3. Lower the dumbbells slowly to the starting position at your upper chest/shoulder level.
4. Repeat for reps.

Coaching Cues:
- Keep the motion controlled; avoid letting the weights drop too low or bouncing off your shoulders.
- Focus on feeling the upper chest engage as you push the dumbbells up.
- Maintain shoulder blade retraction (pinch shoulders together on bench) to protect your shoulders.
- Exhale as you press up and lock out softly at the top without overextending your elbows.`,
        videoUrl: "https://www.youtube.com/watch?v=oZVCBM9f8Eo",
        isPublic: true,
        muscleGroupId: "Chest",
        createdByUserId: null
      },
      {
        name: "Dumbbell Shoulder Press",
        shortDescription: "An overhead press using dumbbells to strengthen the shoulder muscles (deltoids) and triceps.",
        description: `Muscles Worked: Shoulders (Deltoids), Triceps, Upper Chest (stabilizer).

Steps:
1. Sit on a bench with back support (or stand upright) holding a dumbbell in each hand at shoulder height, palms facing forward.
2. Brace your core and press the dumbbells upward until your arms are fully extended overhead without locking out harshly.
3. At the top, the dumbbells can come close together but not clash.
4. Lower the weights back down slowly to the starting position at your shoulders.

Coaching Cues:
- Keep your back pressed against the bench (if seated) or core braced (if standing) to avoid leaning or arching.
- Do not flare your elbows out completely; keep them slightly forward in the pressing motion for shoulder safety.
- Press the weight up in a smooth arc, and bring your head forward slightly as weights pass overhead.
- Stop just short of locking out elbows to maintain tension on the muscles and protect your joints.`,
        videoUrl: "https://www.youtube.com/watch?v=qEwKCR5JCog",
        isPublic: true,
        muscleGroupId: "Shoulders",
        createdByUserId: null
      },
      {
        name: "Dumbbell Lateral Raise",
        shortDescription: "An isolation exercise for the shoulders where you lift dumbbells out to the sides to shoulder height, targeting the lateral deltoids.",
        description: `Muscles Worked: Shoulders (lateral deltoid), traps secondarily.

Steps:
1. Stand (or sit) with a dumbbell in each hand at your sides, palms facing inward toward your body.
2. Keeping a slight bend in your elbows, raise both arms out to the sides until they are about parallel to the floor (shoulder height). Your palms face downward at the top position.
3. Pause briefly at the top, focusing on the contraction in your shoulder muscles.
4. Lower the dumbbells back down slowly to your sides.

Coaching Cues:
- Lead with your elbows and keep a slight bend in them; your elbows and wrists should rise together in the same plane.
- Lift in a controlled manner; do not swing the weights or use momentum.
- Only go as high as shoulder level; no need to lift above that, which can stress your shoulders.
- Keep your core engaged and avoid shrugging your shoulders up during the lift (focus on the delts doing the work).`,
        videoUrl: "https://www.youtube.com/watch?v=4p_m96HXMLk",
        isPublic: true,
        muscleGroupId: "Shoulders",
        createdByUserId: null
      },
      {
        name: "Dumbbell Front Raise",
        shortDescription: "An isolation exercise targeting the front part of the shoulders, raising dumbbells straight in front to shoulder height.",
        description: `Muscles Worked: Shoulders (anterior deltoid), with some upper chest and traps.

Steps:
1. Stand with feet hip-width apart, holding a dumbbell in each hand in front of your thighs, palms facing toward your body.
2. Keeping your arms relatively straight (slight elbow bend), lift one or both dumbbells straight up in front of you to shoulder height.
3. Pause briefly when your arms reach parallel to the ground (shoulder level).
4. Lower the dumbbell(s) back down under control to the starting position.

Coaching Cues:
- Avoid using momentum; lift the weight in a controlled fashion using your shoulder muscles.
- Keep your torso stationary; do not lean back as you lift.
- Maintain a slight bend at the elbows and keep wrists neutral (not bending up or down).
- Exhale as you lift and inhale as you lower, keeping movements smooth.`,
        videoUrl: "https://www.youtube.com/watch?v=-t7fuZ0KhDA",
        isPublic: true,
        muscleGroupId: "Shoulders",
        createdByUserId: null
      },
      {
        name: "Dumbbell Rear Delt Fly",
        shortDescription: "An isolation exercise for the rear shoulders (rear deltoids) performed bent over, lifting dumbbells out to the sides.",
        description: `Muscles Worked: Shoulders (rear deltoids), upper back (rhomboids, traps).

Steps:
1. Hold a dumbbell in each hand and hinge at the hips to bend forward ~45 degrees or more. Let the dumbbells hang below your shoulders, palms facing each other.
2. With a slight bend in your elbows, lift the dumbbells out to the sides, squeezing your shoulder blades together, until your arms are roughly parallel to the floor.
3. Focus on leading the movement with your rear shoulder muscles; keep your neck neutral.
4. Lower the weights back down under control to the starting position.

Coaching Cues:
- Keep your back flat and core engaged while bent over to support your spine.
- Avoid swinging the weights; lift purely by contracting the rear shoulder and upper back muscles.
- Think about pinching your shoulder blades together at the top of the movement.
- Use lighter weight for this exercise to maintain strict form, as rear delts are smaller muscles.`,
        videoUrl: "https://www.youtube.com/watch?v=3oujCQxeCaI",
        isPublic: true,
        muscleGroupId: "Shoulders",
        createdByUserId: null
      },
      {
        name: "Dumbbell One-Arm Row",
        shortDescription: "A unilateral back exercise where you row a dumbbell up to your side, targeting the lats and upper back.",
        description: `Muscles Worked: Back (latissimus dorsi, traps, rhomboids), Biceps.

Steps:
1. Place your right knee and right hand on a bench for support, keeping your back flat. Hold a dumbbell in your left hand, arm extended toward the floor.
2. Keeping your shoulders square, pull the dumbbell up toward the side of your torso, driving your elbow back and up.
3. Squeeze your back muscles at the top with the dumbbell near your ribcage.
4. Lower the dumbbell back down with control until your arm is fully extended. Complete all reps on one side, then switch to the other arm.

Coaching Cues:
- Keep your back flat and parallel to the ground; avoid rotating your torso as you row.
- Lead with your elbow and focus on pulling with your back rather than your arm.
- Don't let your shoulder drop at the bottom; keep your shoulder blade retracted for stability.
- Control the weight throughout the movement, avoiding any jerking motion.`,
        videoUrl: "https://www.youtube.com/watch?v=1w7lJPTcxH4",
        isPublic: true,
        muscleGroupId: "Back",
        createdByUserId: null
      },
      {
        name: "Dumbbell Pullover",
        shortDescription: "An upper-body exercise performed lying on a bench, lowering a dumbbell behind your head and pulling it back up, working the chest and lat muscles.",
        description: `Muscles Worked: Back (lats) and Chest (pecs), also serratus and triceps secondary.

Steps:
1. Lie face-up on a flat bench, holding one dumbbell with both hands (hands under the inside plate, thumbs and index fingers making a diamond shape around the handle). Extend your arms above your chest.
2. Keep a slight bend in your elbows and slowly lower the dumbbell in an arc behind your head, stretching your chest and lats. Go until your upper arms are roughly in line with your torso or you feel a stretch (dumbbell lowered carefully).
3. Stop before the weight pulls you too far (usually when dumbbell is slightly below bench level behind head).
4. Pull the dumbbell back up to the starting position over your chest by contracting your chest and lats, keeping your arms straightish (still slight bend).

Coaching Cues:
- Keep your core engaged and do not over-arch your back as you lower the weight.
- Use a weight you can control through the full range of motion; this exercise puts shoulders in a stretched position.
- Focus on feeling both the stretch and the contraction in your chest and lats as you move the weight.
- Move in a slow, controlled manner; avoid jerking the weight back up to prevent shoulder strain.`,
        videoUrl: "https://www.youtube.com/watch?v=MGh5po3i5cE",
        isPublic: true,
        muscleGroupId: "Back",
        createdByUserId: null
      },
      {
        name: "Dumbbell Chest Fly",
        shortDescription: "An isolation exercise for the chest performed lying on a bench, opening and closing the arms with dumbbells in a wide arc to target the pectoral muscles.",
        description: `Muscles Worked: Chest (pectorals), with front deltoid and biceps as stabilizers.

Steps:
1. Lie on a flat bench with a dumbbell in each hand, arms extended above your chest, palms facing each other (dumbbells nearly touching).
2. With a slight bend in your elbows, slowly open your arms and lower the dumbbells out to the sides in an arc, stretching your chest, until your arms are near parallel to the floor (or until you feel a good stretch).
3. Keep the same slight elbow bend, and use your chest muscles to bring the dumbbells back up in a controlled arc to meet above your chest.
4. Repeat for the desired reps, keeping the motion smooth and controlled.

Coaching Cues:
- Do not overstretch; lower until you feel a stretch in the chest, but not to the point of shoulder pain.
- Keep that slight bend in the elbows throughout; avoid bending and straightening the arms as that turns it into a press.
- Imagine hugging a big tree or barrel - this helps maintain proper form and chest engagement.
- Use moderate weight and focus on form; this exercise is about isolating the chest, not lifting heavy.`,
        videoUrl: "https://www.youtube.com/watch?v=dU1R-AHW4IM",
        isPublic: true,
        muscleGroupId: "Chest",
        createdByUserId: null
      },
      {
        name: "Dumbbell Bicep Curl",
        shortDescription: "A fundamental exercise targeting the biceps, curling dumbbells from an extended arm position up to the shoulders.",
        description: `Muscles Worked: Biceps.

Steps:
1. Stand holding a dumbbell in each hand at your sides, palms facing forward, arms fully extended.
2. Keeping your elbows pinned to your sides, curl the weights up by bending your elbows, bringing the dumbbells toward your shoulders.
3. Squeeze your biceps at the top of the movement.
4. Lower the dumbbells back down slowly to the starting position, fully straightening your arms at the bottom.

Coaching Cues:
- Do not swing your body or use momentum; keep the movement strict.
- Keep your elbows stationary; only your forearms should move.
- Rotate your palms upward (supinate) as you curl if you prefer a more supinating dumbbell curl (if we consider starting neutral, but we started palms forward anyway).
- Exhale as you lift, inhale as you lower, maintaining a smooth tempo.`,
        videoUrl: "https://www.youtube.com/watch?v=3OZ2MT_5r3Q",
        isPublic: true,
        muscleGroupId: "Biceps",
        createdByUserId: null
      },
      {
        name: "Dumbbell Hammer Curl",
        shortDescription: "A biceps and forearm exercise where you curl dumbbells with a neutral grip (palms facing inward), targeting the brachialis and brachioradialis along with the biceps.",
        description: `Muscles Worked: Biceps (with focus on brachialis, brachioradialis).

Steps:
1. Stand with a dumbbell in each hand, arms at your sides, palms facing your thighs (neutral grip).
2. Keeping your elbows at your sides, curl the dumbbells up toward your shoulders while maintaining the neutral (hammer) grip.
3. Lift until the end of the dumbbell (thumb side) is near shoulder height, squeezing the upper arm.
4. Lower the weights back down in a controlled manner to the starting position, arms fully extended.

Coaching Cues:
- Keep your wrists straight and solid in the neutral position; avoid bending at the wrist.
- Focus on using your biceps and forearms to lift; don't swing or lean back.
- Elbows stay close to your body throughout the exercise.
- Breathe out on the curl up, breathe in while lowering the weights.`,
        videoUrl: "https://www.youtube.com/watch?v=CFBZ4jN1CMI",
        isPublic: true,
        muscleGroupId: "Biceps",
        createdByUserId: null
      },
      {
        name: "Dumbbell Concentration Curl",
        shortDescription: "A biceps isolation exercise done seated, curling a dumbbell with one arm while bracing that arm against your thigh for strict form.",
        description: `Muscles Worked: Biceps.

Steps:
1. Sit on a bench with your feet wide. Hold a dumbbell in your right hand and lean forward slightly, bracing your right elbow against the inside of your right thigh just above the knee.
2. Starting with your arm extended towards the floor, curl the dumbbell up towards your shoulder, keeping the elbow against the thigh for support.
3. Squeeze the bicep at the top of the rep.
4. Lower the dumbbell back down until your arm is extended and the bicep is fully stretched. Complete reps then switch to the left arm.

Coaching Cues:
- Keep the movement strict by keeping your elbow anchored on your thigh; this isolates the bicep.
- Avoid swinging the weight or moving your upper arm; only your forearm should move.
- Use a full range of motion, fully extending and then fully contracting the bicep each rep.
- Concentrate on the muscle (hence the name), really feeling the squeeze at the top of each curl.`,
        videoUrl: "https://www.youtube.com/watch?v=Jvj2wV0vOYU",
        isPublic: true,
        muscleGroupId: "Biceps",
        createdByUserId: null
      },
      {
        name: "Dumbbell Triceps Kickback",
        shortDescription: "An isolation exercise for the triceps performed bent over, extending a dumbbell behind you to work the tricep muscles.",
        description: `Muscles Worked: Triceps.

Steps:
1. Hold a dumbbell in one hand and place the opposite hand and knee on a bench for support (like a one-arm row stance).
2. Start with your upper arm parallel to your torso and elbow bent about 90 degrees, holding the dumbbell near your side.
3. Keeping your upper arm still, extend your elbow to straighten your arm, kicking the dumbbell back until your arm is fully extended and parallel to your body.
4. Squeeze your triceps at full extension, then bend your elbow to slowly return to the starting 90-degree position. Complete all reps then switch arms.

Coaching Cues:
- Keep your upper arm stationary and tight to your side; only the forearm moves during the kickback.
- Use a weight that allows full extension without swinging; this exercise is typically done with lighter weight for strict form.
- Avoid dropping your elbow; maintain that parallel upper arm position throughout.
- Keep your back flat and core engaged as you perform the exercise to avoid strain.`,
        videoUrl: "https://www.youtube.com/watch?v=m9me06UBPKc",
        isPublic: true,
        muscleGroupId: "Triceps",
        createdByUserId: null
      },
      {
        name: "Dumbbell Overhead Triceps Extension",
        shortDescription: "A triceps exercise where you extend a dumbbell overhead, working all three heads of the triceps.",
        description: `Muscles Worked: Triceps.

Steps:
1. Stand or sit upright and hold one dumbbell with both hands overhead (cup the top end of the dumbbell with both palms under the top weight).
2. Keeping your upper arms close to your head and elbows pointing forward (not flared), bend your elbows to lower the dumbbell behind your head.
3. Lower until your forearms go slightly past parallel to the floor (feeling a stretch in the triceps).
4. Engage your triceps to extend your arms, raising the dumbbell back overhead to the starting position.

Coaching Cues:
- Keep your elbows pointing forward and near your ears; avoid letting them drift outward.
- Maintain a tight core to keep your back from arching, especially if standing.
- Use a controlled tempo to avoid elbow strain; don't drop the dumbbell too far behind your head.
- Exhale as you extend your arms, pressing the weight upward.`,
        videoUrl: "https://www.youtube.com/watch?v=YM8iX9BJWjA",
        isPublic: true,
        muscleGroupId: "Triceps",
        createdByUserId: null
      },
      {
        name: "Dumbbell Shrug",
        shortDescription: "An exercise to strengthen the upper trapezius muscles, performed by shrugging the shoulders while holding dumbbells.",
        description: `Muscles Worked: Traps (upper trapezius).

Steps:
1. Stand upright holding a dumbbell in each hand at your sides, palms facing your body.
2. Keeping your arms straight, elevate (shrug) your shoulders straight up toward your ears as high as possible.
3. Pause for a moment at the top of the movement, feeling the contraction in your traps.
4. Lower your shoulders back down to the starting position.

Coaching Cues:
- Keep your head in a neutral position and do not roll your shoulders; move them straight up and down.
- Avoid using momentum; perform the movement slowly to fully engage the traps.
- Breathe out as you shrug up, breathe in as you release down.
- If grip is a limiting factor, use straps or chalk for heavier shrugs, but maintain good form.`,
        videoUrl: "https://www.youtube.com/watch?v=xDt6qbKgLkY",
        isPublic: true,
        muscleGroupId: "Back",
        createdByUserId: null
      },
      {
        name: "Dumbbell Bulgarian Split Squat",
        shortDescription: "A single-leg squat variation with the back foot elevated, performed holding dumbbells for resistance, targeting the quads and glutes.",
        description: `Muscles Worked: Quadriceps, Glutes, Hamstrings.

Steps:
1. Stand a couple feet in front of a bench, holding dumbbells at your sides. Place the top of one foot on the bench behind you.
2. Keeping your torso upright, bend your front knee and lower your body until your front thigh is about parallel to the floor and back knee is lowered toward the ground.
3. Push through the heel of your front foot to stand back up to the starting position.
4. Complete the desired reps on one leg, then switch to the other leg.

Coaching Cues:
- Ensure your front foot is far enough forward that your knee stays roughly over your ankle and doesn't travel too far beyond it.
- Keep the majority of your weight on the front leg; the rear leg is mainly for balance.
- Maintain an upright posture and engaged core throughout to help with balance.
- Use controlled movements; no bouncing at the bottom, and focus on muscle engagement over weight used.`,
        videoUrl: "https://www.youtube.com/watch?v=MGh5po3i5cE",
        isPublic: true,
        muscleGroupId: "Glutes",
        createdByUserId: null
      },
      {
        name: "Dumbbell Calf Raise",
        shortDescription: "A calf-strengthening exercise where you perform heel raises while holding dumbbells, focusing on the calf muscles.",
        description: `Muscles Worked: Calves.

Steps:
1. Stand upright holding dumbbells at your sides. Position the balls of your feet on a step or platform (if available) with heels hanging off, or on flat ground.
2. Lower your heels below the step level to stretch the calves (if on a platform).
3. Press through the balls of your feet to lift your heels as high as possible, rising up on your toes.
4. Squeeze at the top, then lower your heels back down slowly to the starting position (or into a stretch if using a platform).

Coaching Cues:
- Keep your legs straight but not locked; movement should occur at the ankles.
- Use a full range of motion for maximum benefit (deep stretch at bottom, full raise at top).
- Maintain balance by focusing on even pressure on the big toe and little toe sides of your foot.
- Perform the exercise slowly; avoid bouncing to reduce risk of Achilles strain.`,
        videoUrl: "https://www.youtube.com/watch?v=_iYwv4QVFjM",
        isPublic: true,
        muscleGroupId: "Calves",
        createdByUserId: null
      },
      {
        name: "Dumbbell Russian Twist",
        shortDescription: "An abdominal exercise where you rotate your torso side-to-side with a dumbbell, targeting the abs and obliques.",
        description: `Muscles Worked: Abs (with emphasis on obliques).

Steps:
1. Sit on the floor with your knees bent and feet either anchored or hovering slightly above the floor. Hold a dumbbell with both hands in front of your chest.
2. Lean back slightly to engage your core (about a 45° angle with torso). 
3. Rotate your torso to one side, moving the dumbbell beside your hip. Then rotate to the opposite side, bringing the dumbbell to the other hip.
4. Continue alternating sides in a controlled manner. Each twist to both sides is one rep (or count each side separately as needed).

Coaching Cues:
- Keep the movement controlled; avoid using just your arms to swing the weight—rotate your shoulders and torso as a unit.
- Engage your abs throughout and keep your back straight (avoid hunching).
- If you feel strain in your lower back, try doing the exercise with feet on the floor for more support or without weight until stronger.
- Breathe steadily; exhale as you twist, inhale as you return to center.`,
        videoUrl: "https://www.youtube.com/watch?v=FShbaqrGGu4",
        isPublic: true,
        muscleGroupId: "Abs",
        createdByUserId: null
      },
      {
        name: "Cable Chest Fly",
        shortDescription: "A chest isolation exercise using a cable crossover machine, bringing the handles together in front of the chest to target the pectoral muscles.",
        description: `Muscles Worked: Pectoralis Major (Chest), specifically the inner and middle chest fibers; also involves anterior deltoids and stabilizing muscles.

Steps:
1. Position two cable pulleys at chest height (for a mid cable fly). Stand centered between them. Grasp a handle in each hand with arms outstretched to the sides (a slight bend in the elbows). Step one foot forward for a stable staggered stance.
2. Start with a stretch: your arms are out to your sides (but not behind your body) and you feel tension on your chest muscles.
3. Keeping a slight bend in your elbows, bring the handles forward and together in an arc in front of your chest. Your hands should meet (or nearly meet) at the midline of your body, at roughly chest height.
4. Squeeze your chest when the handles are together, then slowly allow your arms to move back to the starting position, controlling the resistance as your chest stretches open.

Coaching Cues:
- Maintain that slight bend in the elbows throughout; don't turn it into a pressing motion by bending/straightening arms.
- Keep your chest up and shoulders back; avoid hunching or letting shoulders roll forward.
- Step forward just enough that there's tension on the cables even when your arms are outstretched.
- Use a weight that allows a smooth motion; focus on the chest doing the work rather than just moving the weight.`,
        videoUrl: "https://www.youtube.com/watch?v=Iwe6AmxVf7o",
        isPublic: true,
        muscleGroupId: "Chest",
        createdByUserId: null
      },
      {
        name: "Cable Seated Row",
        shortDescription: "A cable machine exercise where you row a handle toward your torso from a seated position, targeting the back muscles.",
        description: `Muscles Worked: Middle Back (Rhomboids, Trapezius), Lats, Biceps (assist), Rear Delts.

Steps:
1. Sit at a low pulley cable station, feet braced against the platform, knees slightly bent. Grab the cable row handle with arms extended forward.
2. Keep your back straight and torso upright. Begin by pulling your shoulder blades together and driving your elbows back, bringing the handle toward your abdomen.
3. Pull until your hands reach your midsection, squeezing your back muscles.
4. Slowly extend your arms back to the starting position, letting your shoulder blades protract at the end for a full stretch.

Coaching Cues:
- Avoid using your lower back to jerk the weight; keep the motion in your shoulders and arms.
- Keep your chest up and avoid rounding your back throughout the movement.
- Lead with your elbows and focus on pinching your shoulder blades together at the end of the row.
- Don't shrug your shoulders up; keep them down to better target the back muscles.`,
        videoUrl: "https://www.youtube.com/watch?v=rqwE3UheOqo",
        isPublic: true,
        muscleGroupId: "Back",
        createdByUserId: null
      },
      {
        name: "Cable Lat Pulldown",
        shortDescription: "An exercise using a high pulley to pull a bar down to your chest, targeting the latissimus dorsi and other back muscles.",
        description: `Muscles Worked: Back (lats, also biceps and upper back).

Steps:
1. Sit at a cable pulldown station and grasp the wide bar with an overhand grip, hands wider than shoulder-width. Secure your thighs under the pad.
2. Start with arms extended overhead holding the bar. Slightly lean back (~30°) and pull the bar down towards your upper chest by driving your elbows down and back.
3. Squeeze your back (imagine pulling your shoulder blades down and together) as the bar nears your chest.
4. Slowly release the bar back up overhead until your arms are straight and you feel a stretch in your lats.

Coaching Cues:
- Do not use momentum or swing your body excessively; a slight lean is fine, but keep it controlled.
- Focus on pulling through your back and not just your arms; visualize your elbows driving into your back pockets.
- Avoid pulling the bar behind your neck; stick to the front of the chest to protect your shoulders and neck.
- Keep your chest lifted and shoulders down (away from ears) as you pull.`,
        videoUrl: "https://www.youtube.com/watch?v=j2CoHr4BAj0",
        isPublic: true,
        muscleGroupId: "Back",
        createdByUserId: null
      },
      {
        name: "Cable Face Pull",
        shortDescription: "An upper-back and shoulder exercise using a rope attachment on a cable, pulling towards the face to target the rear delts and traps.",
        description: `Muscles Worked: Rear Deltoids, Upper Back (traps, rhomboids).

Steps:
1. Set a rope attachment on a cable pulley at about face height. Grasp the ends of the rope with an overhand grip (palms facing inward toward each other).
2. Step back to put tension on the cable and stand with feet shoulder-width. Hold arms straight in front at eye level.
3. Pull the rope towards your face, leading with your elbows and flaring them out to the sides. As you pull, externally rotate your arms so that at the end position your hands come to either side of your face and your knuckles point backward.
4. Squeeze your rear shoulder muscles and upper back at the end of the movement, then slowly extend your arms back to the start position.

Coaching Cues:
- Keep your elbows high (around shoulder level) throughout the pull to target the rear delts.
- Focus on squeezing the shoulder blades together and externally rotating the shoulders as you pull.
- Avoid leaning back or using your lower back to pull; use a light weight and strict form for this corrective exercise.
- Keep your neck neutral and core engaged to stabilize your stance.`,
        videoUrl: "https://www.youtube.com/watch?v=cuTBqxntdso",
        isPublic: true,
        muscleGroupId: "Shoulders",
        createdByUserId: null
      },
      {
        name: "Cable Biceps Curl",
        shortDescription: "A bicep exercise performed using a cable machine, curling a bar or handle upward to work the biceps with constant tension.",
        description: `Muscles Worked: Biceps.

Steps:
1. Stand facing a low pulley machine with a straight or EZ-curl bar attached. Grasp the bar with an underhand grip, hands about shoulder-width apart, arms extended down.
2. Keeping your elbows at your sides, curl the bar upward toward your chest by contracting your biceps.
3. Continue until your elbows are fully bent and the bar is at shoulder level.
4. Squeeze your biceps, then lower the bar back down in a controlled manner to the starting position, fully extending your arms.

Coaching Cues:
- Keep your elbows stationary and tucked in to your sides; don't let them drift forward.
- Avoid leaning or using your back to lift; keep your body still and let the biceps do the work.
- The cable provides constant tension, so control both the lifting and lowering phase deliberately.
- Exhale as you curl up, inhale as you lower.`,
        videoUrl: "https://www.youtube.com/watch?v=rfRdD5PKrko",
        isPublic: true,
        muscleGroupId: "Biceps",
        createdByUserId: null
      },
      {
        name: "Cable Triceps Pushdown",
        shortDescription: "A triceps isolation exercise using a cable, pushing down a bar or rope attachment to work the triceps.",
        description: `Muscles Worked: Triceps.

Steps:
1. Stand facing a high pulley cable with a straight bar or rope attached. Grip the bar with an overhand grip (or rope ends with neutral grip) at about chest height.
2. Tuck your elbows to your sides. Starting with elbows bent (~90 degrees), push the bar/rope down by extending your elbows, until your arms are straight and hands are near your thighs.
3. Squeeze your triceps at the bottom of the movement.
4. Let your arms bend at the elbows to raise the bar back up to the starting position (around chest level), under control.

Coaching Cues:
- Keep your upper arms stationary and close to your body; only the forearms move.
- Avoid flaring your elbows; keep them pointed downwards to focus on the triceps.
- Use a full range of motion: fully extend (without locking hard) and allow a full but controlled bend at the top.
- Keep your torso upright and core engaged; do not swing or lean over excessively.`,
        videoUrl: "https://www.youtube.com/watch?v=6Fzep104f0s",
        isPublic: true,
        muscleGroupId: "Triceps",
        createdByUserId: null
      },
      {
        name: "Cable Overhead Triceps Extension",
        shortDescription: "A triceps exercise using a cable machine, performed by extending the arms overhead (often with a rope attachment) to target the triceps.",
        description: `Muscles Worked: Triceps.

Steps:
1. Attach a rope to a low pulley or bottom of a cable machine. Facing away from the machine, grab the rope with both hands and step forward with one foot, positioning the rope behind your head. Your elbows should be bent and pointing up, hands holding the rope by your ears/behind head.
2. Lean forward slightly and keep your head up. Starting from the bent elbow position, extend your arms forward and slightly upward, straightening your elbows and pushing the rope out in front of your head until arms are extended.
3. Squeeze your triceps at full extension.
4. Control the rope back to the starting position behind your head by bending your elbows, keeping them in place.

Coaching Cues:
- Keep your elbows close to your head and pointing forward throughout the motion.
- Avoid arching your back; keep your core tight to stabilize as you press.
- Use a weight that allows you to keep the movement strictly in the triceps (if too heavy you'll tend to drop your elbows or use shoulders).
- Perform the movement slowly to avoid hitting your head or neck with the rope/cable.`,
        videoUrl: "https://www.youtube.com/watch?v=1u18yJELsh0",
        isPublic: true,
        muscleGroupId: "Triceps",
        createdByUserId: null
      },
      {
        name: "Cable Glute Kickback",
        shortDescription: "A lower-body isolation exercise using a cable machine, where you extend one leg straight back to target the glutes.",
        description: `Muscles Worked: Glutes (and hamstrings somewhat).

Steps:
1. Attach an ankle cuff to a low cable pulley and secure it around your ankle. Stand facing the machine and hold onto it for support. 
2. Starting with the working leg slightly bent and forward, kick your leg straight back by squeezing your glute, extending at the hip.
3. Go until your hip is fully extended (leg straight back and raised slightly).
4. Return your leg to the starting position with control, resisting the pull of the cable. Perform all reps on one side then switch legs.

Coaching Cues:
- Focus on the mind-muscle connection with your glute; it's easy to let your lower back or momentum take over if not careful.
- Keep the movement slow and controlled, especially when returning to the start, to maintain tension on the glute.
- Maintain a slight forward lean but keep your back straight; don't excessively arch or round the lower back.
- Keep your core engaged for balance.`,
        videoUrl: "https://www.youtube.com/watch?v=dU1R-AHW4IM",
        isPublic: true,
        muscleGroupId: "Glutes",
        createdByUserId: null
      },
      {
        name: "Cable Pull-Through",
        shortDescription: "A posterior chain exercise using a cable, where you pull a rope attachment through your legs by hinging at the hips, targeting glutes and hamstrings.",
        description: `Muscles Worked: Glutes, Hamstrings, (lower back).

Steps:
1. Attach a rope to a low pulley. Stand facing away from the machine, feet shoulder-width apart. Reach down between your legs and grab the rope with both hands, palms facing each other.
2. Step forward a bit to create tension. Start in a hinged position: bent at the hips with a slight bend in knees, back flat, arms extended holding the rope between legs.
3. Thrust your hips forward to stand up straight, pulling the rope through your legs until you are upright. Squeeze your glutes at the top.
4. Allow the rope to pull your hips back as you bend forward again, returning to the hinged position while keeping your back flat, to begin the next rep.

Coaching Cues:
- This motion is a hip hinge, so focus on moving your hips back and forward, not squatting down.
- Keep your arms straight; they are just holding the rope. The power comes from hip extension by the glutes.
- Look forward or slightly down to keep your back in a neutral position, and engage your core.
- Squeeze your glutes forcefully at the top, and avoid leaning back once fully upright.`,
        videoUrl: "https://www.youtube.com/watch?v=4oZ_0_bQcOg",
        isPublic: true,
        muscleGroupId: "Glutes",
        createdByUserId: null
      },
      {
        name: "Cable Crunch",
        shortDescription: "An abdominal exercise performed on a cable machine, where you crunch your torso down against resistance to strengthen the abs.",
        description: `Muscles Worked: Rectus Abdominis (and obliques as stabilizers).

Steps:
1. Attach a rope to a high pulley and kneel a couple of feet away from the machine, facing it. Grab the rope ends and hold them near the sides of your head.
2. Start upright on your knees with your hips stationary. Crunch your torso down by contracting your abs, bringing your elbows toward your thighs.
3. Hold the bottom contraction briefly, feeling the squeeze in your abs.
4. Slowly return to the starting upright position, stretching your abs but without letting tension off the cable.

Coaching Cues:
- Keep your hips fixed; the movement should come from your spine flexing (using abs), not from sitting back with your hips.
- Tuck your chin slightly and focus on curling your chest towards your pelvis in the crunch.
- Use your abs to control the weight, not arm strength; arms just hold the rope in place.
- Breathe out as you crunch down (to engage abs more), and breathe in as you return up.`,
        videoUrl: "https://www.youtube.com/watch?v=3qjoXDTuyOE",
        isPublic: true,
        muscleGroupId: "Abs",
        createdByUserId: null
      },
      {
        name: "Cable Woodchopper",
        shortDescription: "A core exercise involving a twisting motion using a cable, mimicking a wood-chopping movement to work the abs and obliques.",
        description: `Muscles Worked: Obliques, Abs (with some hips and lower back stabilizers).

Steps:
1. Set a cable pulley to a high position. Stand sideways to the machine, feet shoulder-width apart, and grab the handle with both hands above the shoulder nearest to the pulley.
2. In one motion, pull the cable down and across your body to the opposite side near your hip, while twisting your torso. Allow your hips to rotate and back foot to pivot for a natural movement.
3. Keep arms mostly straight and core engaged as you perform the chopping motion.
4. Control the handle back up to the starting position above your shoulder. Complete reps, then switch to the other side.

Coaching Cues:
- Initiate the movement with your core, not just your arms; think of driving the movement with your abs/obliques.
- Pivot your back foot and allow your hips to rotate for a natural movement, but the power should come from the torso rotation.
- Keep a slight bend in the knees for stability.
- Maintain a consistent tempo; avoid letting the weight pull you uncontrollably back to start.`,
        videoUrl: "https://www.youtube.com/watch?v=oL7exAOo_0I",
        isPublic: true,
        muscleGroupId: "Abs",
        createdByUserId: null
      },
      {
        name: "Cable Lateral Raise",
        shortDescription: "A shoulder isolation exercise using a cable to raise your arm out to the side, targeting the lateral deltoid.",
        description: `Muscles Worked: Shoulders (side delts).

Steps:
1. Stand sideways next to a low cable pulley. Attach a single handle and grasp it with the hand farthest from the machine.
2. Start with your arm down across your body in front of you (cable crossing in front). With a slight bend in your elbow, lift your arm out to the side up to shoulder height.
3. Keep your palm facing down or slightly forward as you raise.
4. Lower your arm back to the starting position under control. Complete reps on one arm, then switch to the other.

Coaching Cues:
- Keep movements slow and controlled; cables provide resistance through the entire range, so no jerking.
- Avoid leaning in or away excessively; a slight lean away from the cable can help range, but keep torso fairly stationary.
- Focus on the deltoid lifting the weight; lead with your elbow.
- Don't take the arm above shoulder height to maintain tension on the target muscle and avoid unnecessary stress.`,
        videoUrl: "https://www.youtube.com/watch?v=Z5FA9aq3L6A",
        isPublic: true,
        muscleGroupId: "Shoulders",
        createdByUserId: null
      }
    ]
  });  
  

}

main();
  


  
