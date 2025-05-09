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
        name: "Back Squat",
        shortDescription: "Barbell squat targeting the thighs (quads & glutes), where you squat down and stand back up with the bar on your upper back.",
        description: "Stand with feet about shoulder-width apart and the barbell resting on your upper back/traps. Brace your core and keep your chest up. Squat down by bending at the hips and knees, keeping your knees out and heels flat on the floor. Go down until your thighs are at least parallel to the floor (or lower, if comfortable), then drive through your heels to return to standing. Maintain a neutral spine and avoid letting your knees cave inward throughout the movement:contentReference[oaicite:73]{index=73}:contentReference[oaicite:74]{index=74}. Fully extend your hips and knees at the top of each rep.",
        videoUrl: "https://www.youtube.com/watch?v=-OQvt9c3Kvk",
        isPublic: true,
        muscleGroupId: "Quads",
        createdByUserId: null,
        
      },
      {
        name: "Front Squat",
        shortDescription: "Squat variation emphasizing the quads, performed with the barbell held across the front of your shoulders.",
        description: "Start with the barbell racked on the front of your shoulders (resting on your delts/clavicles) with your elbows lifted high and arms parallel to the ground. Use a clean grip or cross-arm grip to balance the bar. With a shoulder-width stance, core braced, and an upright torso, squat straight down by bending your knees. Keep your elbows up and chest tall as you descend, preventing the bar from tipping forward:contentReference[oaicite:75]{index=75}. Go as low as you can while maintaining form (ideally to parallel or below), then push through your whole foot to stand back up. Front squats place more demand on your quadriceps and upper back while reducing stress on the lower back.",
        videoUrl: "https://www.youtube.com/watch?v=7pyxT5hqmQY",
        isPublic: true,
        muscleGroupId: "Quads",
        createdByUserId: null,
        
      },
      {
        name: "Bulgarian Split Squat",
        shortDescription: "Single-leg squat with rear foot elevated. Great for quads and glutes, improving balance and leg strength equally.",
        description: "Stand lunge-length in front of a bench, holding dumbbells at your sides (or a barbell on your back). Place the top of your rear foot on the bench behind you. Keeping your torso upright, bend your front knee and hip to lower your body. Drop straight down until your front thigh is about parallel to the floor (your back knee hovering just above the ground). Ensure your front knee tracks in line with your toes (not caving inward). Drive through the heel of your front foot to rise back up. Complete all reps on one leg then switch. The elevated rear foot increases the load on the front-leg quads and glutes, making this an excellent unilateral leg exercise.",
        videoUrl: "https://www.youtube.com/watch?v=DeCnHqrN22U",
        isPublic: true,
        muscleGroupId: "Quads",
        createdByUserId: null,
        
      },
      {
        name: "Leg Press",
        shortDescription: "Machine exercise for the legs where you press a platform away with your feet. Targets the quadriceps with support.",
        description: "Sit in the leg press machine with your back and hips against the pads. Place your feet shoulder-width apart on the platform. Unlock the safeties and bend your knees to lower the platform toward you. Go as deep as comfortable (around 90° knee bend or slightly more) while keeping your lower back planted. Press the weight back up by extending your knees and hips. **Do not lock out your knees** at the top; keep a slight bend to maintain tension and protect your joints:contentReference[oaicite:76]{index=76}. Control the descent of the weight each rep. The leg press allows you to train your quads (and glutes) with heavy loads and reduced balance requirements compared to squats.",
        videoUrl: "https://www.youtube.com/watch?v=N3awlEyTY98",
        isPublic: true,
        muscleGroupId: "Quads",
        createdByUserId: null,
        
      },
      {
        name: "Romanian Deadlift",
        shortDescription: "Stiff-legged barbell deadlift focusing on the hamstrings and glutes. Performed by hinging at the hips with a slight knee bend.",
        description: "Stand with feet hip-width apart, holding a barbell in front of you (overhand or mixed grip). Soften your knees slightly. Initiate the movement by pushing your hips backward, keeping your back straight and shoulders pulled back. Slide the bar down your thighs as you hinge, keeping it close to your legs:contentReference[oaicite:77]{index=77}. Lower until you feel a strong stretch in your hamstrings (typically the bar reaches mid-shin or just below the knees). Maintain a neutral spine and do not round your lower back. To return, drive your hips forward and stand tall, squeezing your glutes at the top. The RDL emphasizes the hamstrings through a large range of motion and should be performed with controlled tempo, especially on the way down.",
        videoUrl: "https://www.youtube.com/watch?v=aHEg-DDo4fY",
        isPublic: true,
        muscleGroupId: "Hamstrings",
        createdByUserId: null,
        
      },
      {
        name: "Good Morning",
        shortDescription: "Hip-hinge exercise with a bar on your back, bowing forward to work the hamstrings, glutes, and lower back.",
        description: "Begin with a barbell on your upper back (as in a squat). Stand with feet shoulder-width and a slight bend in your knees. Keeping your back flat and core braced, hinge at the hips by pushing your butt backward. Lean your torso forward as if you're bowing, maintaining neutral spine alignment. Go down until your torso is near parallel to the ground (or a comfortable limit where your hamstrings stretch significantly). **Do not allow your back to round** during the descent. Reverse the motion by contracting your hamstrings and glutes to bring your torso upright again. Keep your weight balanced over your midfoot throughout. Good mornings are advanced – start with light weight and focus on form to safely strengthen the posterior chain.",
        videoUrl: "https://www.youtube.com/watch?v=f23vXjoG2e8",
        isPublic: true,
        muscleGroupId: "Hamstrings",
        createdByUserId: null,
        
      },
      {
        name: "Nordic Hamstring Curl",
        shortDescription: "Advanced bodyweight hamstring exercise where you lower your upper body from a kneeling position, using your hamstrings to resist the drop.",
        description: "Kneel on a padded surface with your ankles secured (under a padded bar or held by a partner). Keep your torso upright and arms crossed over your chest (or at your sides). From this tall-kneeling position, slowly lean forward, **keeping your body straight from knees to head**:contentReference[oaicite:78]{index=78}. Use your hamstrings to control the descent as much as possible. When you can no longer resist, catch yourself with your hands on the ground. You can push lightly off the ground to help curl yourself back up to the start. Focus on keeping hips extended (avoid sticking your butt out) and engage your glutes to assist. Nordics are very challenging eccentrically – aim for a slow, controlled lowering to maximize hamstring engagement. Over time, this exercise can greatly improve hamstring strength and resilience.",
        videoUrl: "https://www.youtube.com/watch?v=_e9vFU9-tkc",
        isPublic: true,
        muscleGroupId: "Hamstrings",
        createdByUserId: null,
        
      },
      {
        name: "Standing Calf Raise",
        shortDescription: "Calf exercise done standing (often on a machine). You lift and lower your heels to work the gastrocnemius muscles.",
        description: "Position yourself on a standing calf raise machine (shoulders under pads) with the balls of your feet on the platform and heels hanging off. Start from the bottom: heels dropped to feel a stretch in your calves. From that stretch, press through your toes to raise your heels as high as possible, standing on your tiptoes. Pause briefly at the top, contracting your calves. Then **lower your heels down slowly** to a full stretch:contentReference[oaicite:79]{index=79}. Avoid bouncing at the bottom – use a controlled motion to engage the calves through the full range:contentReference[oaicite:80]{index=80}. Keep your knees straight but not locked. Aim for maximal range each rep: full stretch to full plantarflexion (this ensures better muscle activation and growth).",
        videoUrl: "https://www.youtube.com/watch?v=Xa18jxyeSnM",
        isPublic: true,
        muscleGroupId: "Calves",
        createdByUserId: null,
        
      },
      {
        name: "Seated Calf Raise",
        shortDescription: "Calf exercise performed seated to target the soleus muscle. Involves raising and lowering the heels with bent knees.",
        description: "Sit in a seated calf raise machine, thighs under the pad and balls of your feet on the foot platform. Begin with your heels lowered to get a deep stretch in the calf. From there, push through the balls of your feet to lift your heels as high as possible. **Ensure a full range: drop the heels fully, then raise up to full contraction:contentReference[oaicite:81]{index=81}**. Keep the movement controlled; avoid bouncing to exploit the stretch reflex. Because your knees are bent ~90°, the seated calf raise isolates the soleus (the deeper calf muscle). Focus on feeling that muscle work by using a moderate tempo and not locking out or resting at the top/bottom. As always, do not lock your knees (they remain bent throughout).",
        videoUrl: "https://www.youtube.com/watch?v=N3awlEyTY98",
        isPublic: true,
        muscleGroupId: "Calves",
        createdByUserId: null,
        
      },
      {
        name: "Barbell Hip Thrust",
        shortDescription: "Glute-focused exercise where you thrust your hips upward with a barbell across your lap, using a bench for support.",
        description: "Sit on the ground with your upper back against a bench (bench behind you). Roll a padded barbell over your hips. Position your feet shoulder-width apart, knees bent ~90° at top. Drive through your **heels** to lift your hips off the ground, raising them until your torso is roughly parallel to the floor:contentReference[oaicite:82]{index=82}. At the top, your shins should be vertical and your knees at ~90° – adjust foot placement if not:contentReference[oaicite:83]{index=83}. Squeeze your glutes hard and achieve full hip extension (without hyperextending your low back):contentReference[oaicite:84]{index=84}. Slowly lower your hips back down until they hover just above the floor, then repeat. Keep your chin tucked slightly and eyes forward (this can help prevent overarching). The hip thrust places maximum tension on the gluteus maximus through a large range of motion, making it extremely effective for building glute strength and size.",
        videoUrl: "https://www.youtube.com/watch?v=U5U6JNIiZ_Q",
        isPublic: true,
        muscleGroupId: "Glutes",
        createdByUserId: null,
        
      },
      {
        name: "Sumo Deadlift",
        shortDescription: "Deadlift variation with a wide stance and hands inside the knees. Emphasizes glutes, hamstrings, and inner thighs.",
        description: "Stand with a wide stance (feet 1.5–2x shoulder width apart) and toes angled out about 30°. Squat down and grip the bar with hands about shoulder-width apart, **inside** your legs. Your shins should be vertical or slightly angled (knees tracking over toes). Flatten your back, tighten your lats, and brace your core. Push through your feet and extend your knees and hips to lift the bar. Keep your chest up and bar close to your body the whole way. Once fully standing (hips locked out), squeeze your glutes. Then hinge at the hips and bend your knees to lower the bar under control. The sumo stance reduces range of motion and torso lean, putting more load on the hips and thighs. It’s a great alternative deadlift style for lifters who want to target the glutes and adductors while minimizing lower back strain.",
        videoUrl: "https://www.youtube.com/watch?v=7FwGZ8qY5OU",
        isPublic: true,
        muscleGroupId: "Glutes",
        createdByUserId: null,
        
      },
      {
        name: "Plank",
        shortDescription: "Core stabilization exercise where you hold a straight-body position, face down, supported on your forearms and toes.",
        description: "Lie face down and prop yourself up on your forearms and toes. Position elbows directly under shoulders. **Engage your abs and glutes** to create a straight line from head to heels:contentReference[oaicite:85]{index=85}. Avoid sagging your lower back or hiking your hips up – your body should stay rigid. Keep your neck neutral by looking at the floor just ahead of your hands. Breathe normally while maintaining tension. Start with shorter holds (20–30 seconds) focusing on perfect form, and gradually extend the time. The plank trains your core to resist extension, building endurance in the abs, obliques, and lower back, which is crucial for overall trunk stability:contentReference[oaicite:86]{index=86}:contentReference[oaicite:87]{index=87}.",
        videoUrl: "https://www.youtube.com/watch?v=Vdcy7VrRluA",
        isPublic: true,
        muscleGroupId: "Abs",
        createdByUserId: null,
        
      },
      {
        name: "Ab Wheel Rollout",
        shortDescription: "Advanced core exercise using an ab wheel. You roll out from the knees and back, requiring strong abdominal control.",
        description: "Kneel on a mat holding an ab wheel beneath your shoulders. Tuck your pelvis (posterior tilt) and **brace your core, rounding your upper back slightly** to start:contentReference[oaicite:88]{index=88}. Slowly roll the wheel forward, extending your arms and hips. Go out as far as you can while keeping your abs tight and preventing your lower back from sagging (your body should form a straight line from knees to head). Pause briefly at the extended position – you’ll feel your abs intensely resisting the stretch. Next, pull with your abs and lats to roll back to the start, maintaining control. The goal is to keep a hollow-body posture throughout to protect the spine:contentReference[oaicite:89]{index=89}. If full rollouts are too difficult, begin with partials or perform the movement on an incline. Ab wheel rollouts are highly effective for building a strong, functional core, but require sufficient baseline strength – progress carefully.",
        videoUrl: "https://www.youtube.com/watch?v=1G0y8D5rFDc",
        isPublic: true,
        muscleGroupId: "Abs",
        createdByUserId: null,
        
      },
      {
        name: "Hanging Leg Raise",
        shortDescription: "An abdominal exercise done hanging from a bar, where you lift your legs up to work the abs and hip flexors.",
        description: "Hang from a pull-up bar with an overhand grip (hands slightly wider than shoulder width). Keeping your legs as straight as possible, use your abs to raise your legs up in front of you. Curl your pelvis upward slightly as your legs come up, aiming to bring your toes (or shins) to about eye level or higher. **Focus on your lower abs contracting to lift your hips** at the top of the motion. Avoid swinging or using momentum – a slow, controlled lift and descent is key. Lower your legs back down until fully extended (or your feet slightly below body line for a full stretch) under control. If a straight-leg raise is too hard, start with bent-knee raises and gradually increase the lever arm. Hanging leg raises, when done strictly, engage the entire abdominal wall, particularly the lower abs, and also improve grip and shoulder stability.",
        videoUrl: "https://www.youtube.com/watch?v=NF4nbNsqreQ",
        isPublic: true,
        muscleGroupId: "Abs",
        createdByUserId: null,
        
      },
      {
        name: "Deadlift",
        shortDescription: "Classic barbell deadlift from the floor, working the entire posterior chain (back, glutes, hamstrings). Builds raw strength.",
        description: "Stand with your mid-foot under the bar, feet hip-width apart. Bend down and grip the bar just outside your legs. Drop your hips slightly and lift your chest, looking forward. Your back should be flat and **shoulders directly over (or just in front of) the bar**. Take a deep breath, brace your core, and drive through your legs to pull the bar off the floor:contentReference[oaicite:90]{index=90}:contentReference[oaicite:91]{index=91}. Keep the barbell **close to your body** – it should almost slide up your shins:contentReference[oaicite:92]{index=92}. Once the bar passes your knees, drive your hips forward to stand up fully, contracting your glutes. Reverse the motion by pushing your hips back and bending your knees to lower the bar down in control. Reset your brace each rep. The deadlift is a full-body lift, but it’s listed under “Back” because maintaining spinal alignment and tension heavily works the back muscles. Use perfect form and avoid any jerking or rounding of the lower back.",
        videoUrl: "https://www.youtube.com/watch?v=A0NBCkpYatQ",
        isPublic: true,
        muscleGroupId: "Back",
        createdByUserId: null,
        
      },
      {
        name: "Bent-Over Barbell Row",
        shortDescription: "Barbell rowing exercise for the back. Performed hinged over, pulling the barbell toward your torso to build lats and upper back.",
        description: "Hold a barbell with an overhand grip, hands about shoulder-width. From standing, hinge at the hips until your torso is roughly 45° to almost parallel to the floor, knees slightly bent. Keep your back straight and core tight in this position. Let the bar hang at arm’s length. Now **pull the bar toward your lower chest/upper abdomen**, leading with your elbows driving back. Squeeze your shoulder blades together at the top of the row, then slowly lower the bar back down until your arms are straight. Avoid using your torso to heave the weight; keep your body fixed and let your back do the work. Exhale as you pull, inhale as you lower. This exercise targets the lats, rhomboids, and traps, helping build a thick, strong back:contentReference[oaicite:93]{index=93}:contentReference[oaicite:94]{index=94}.",
        videoUrl: "https://www.youtube.com/watch?v=o2qSVwxiFk4",
        isPublic: true,
        muscleGroupId: "Back",
        createdByUserId: null,
        
      },
      {
        name: "Pull-Up",
        shortDescription: "Bodyweight pull-up using an overhand grip. Develops the lats and upper back by pulling your body up to a bar.",
        description: "Grab a pull-up bar with a shoulder-width or slightly wider overhand grip (palms facing away). Hang with arms fully extended. Initiate the pull by depressing your scapulae (think “down and back” with the shoulders) and then continue by pulling your elbows down to your sides. Lift your body up until your chin clears the bar. Avoid swinging or kipping; use a controlled motion. Lower yourself all the way down until your arms are straight (full hang) between reps:contentReference[oaicite:95]{index=95}. If you’re new to pull-ups, use an assisted pull-up machine or resistance band to gradually build strength. The overhand pull-up emphasizes the latissimus dorsi and upper-mid back, contributing greatly to back width and strength. Aim for chest up and shoulders back during the movement to fully engage the target muscles.",
        videoUrl: "https://www.youtube.com/watch?v=NF4nbNsqreQ",
        isPublic: true,
        muscleGroupId: "Back",
        createdByUserId: null,
        
      },
      {
        name: "Bench Press",
        shortDescription: "Flat barbell bench press for the chest, shoulders, and triceps. You press a barbell upward while lying on a bench.",
        description: "Lie on a flat bench with your feet planted firmly on the floor. Grip the barbell with hands just wider than shoulder-width. **Set your shoulder blades together and down** (scapulae retracted and depressed) to stabilize your shoulders:contentReference[oaicite:96]{index=96}. Unrack the bar and position it above your chest. Lower the bar under control to touch around mid-chest level, keeping your elbows at ~45° angle from your body. Maintain a slight arch in your lower back (natural arch) and keep your butt on the bench. Without bouncing the bar, press it upward by extending your arms, pushing the bar back to the start position over your chest. Lock out your arms gently (don’t snap the elbows) and repeat. Throughout the press, keep your wrists straight (stacked over your elbows) and engage your lats for stability. The bench press is a primary builder of upper body pushing strength, hitting the pectorals, anterior delts, and triceps.",
        videoUrl: "https://www.youtube.com/watch?v=A0NBCkpYatQ",
        isPublic: true,
        muscleGroupId: "Chest",
        createdByUserId: null,
        
      },
      {
        name: "Incline Bench Press",
        shortDescription: "Barbell press on an inclined bench (~30–45°). Emphasizes the upper chest and front shoulders more than flat bench.",
        description: "Set an incline bench to about 30°–45°. Lie back and grip the bar slightly wider than shoulder width. Pinch your shoulder blades together and down on the bench to lock your shoulders in place. Unrack the bar and hold it above your clavicle area. Inhale and lower the bar to the upper chest/just below the collarbone. Keep your elbows under or slightly in front of the bar (avoiding excessive flare) as you descend. Touch lightly on the chest, then drive the bar up, pushing slightly back towards your face. Exhale as you press to straight arms. Don’t let your elbows flare out too wide; a moderate tuck will place the stress on your chest muscles. Incline bench press shifts more focus to the top portion of the chest (clavicular head) and the anterior deltoids, helping build a well-rounded chest.",
        videoUrl: "https://www.youtube.com/watch?v=lJ2o89kcnxY",
        isPublic: true,
        muscleGroupId: "Chest",
        createdByUserId: null,
        
      },
      {
        name: "Cable Chest Fly",
        shortDescription: "Isolation chest exercise using cables. You 'fly' your arms together in a wide arc to work the pectoral muscles.",
        description: "Stand centered between two high cable pulleys. Grasp a D-handle in each hand. Step forward with one foot for balance, and lean slightly forward. Start with arms open wide to your sides (a stretch on the chest), slight bend in the elbows. Keeping that elbow angle, **bring your hands in an arc forward and together** in front of your chest. Focus on contracting your chest muscles to pull the arms together (imagine hugging a big tree). When your hands meet (or cross slightly) in front of you, squeeze your chest, then slowly allow your arms to move back out to the starting stretch. Inhale on the way back, exhale as you bring the handles together. Keep shoulders down away from your ears throughout the movement. The constant tension of the cables makes this an excellent exercise to isolate and pump the chest, especially after heavier presses.",
        videoUrl: "https://www.youtube.com/watch?v=HOWPPDueZY8",
        isPublic: true,
        muscleGroupId: "Chest",
        createdByUserId: null,
        
      },
      {
        name: "Overhead Press",
        shortDescription: "Standing barbell press overhead. Builds shoulder and triceps strength by pressing a bar from the shoulders to overhead.",
        description: "Stand with your feet shoulder-width apart and the barbell racked at shoulder level (hands just outside shoulder width). Grip the bar firmly and bring it to your shoulders, with elbows slightly forward. Brace your abs and squeeze your glutes to **prevent an excessive back arch**:contentReference[oaicite:97]{index=97}. Press the bar upward and slightly back, moving your head back out of the way, then under the bar as it passes your forehead:contentReference[oaicite:98]{index=98}. Lock out your arms overhead so the bar is over the mid-foot balance point. At the top, your elbows should be locked and shrug your shoulders up a bit. Lower the bar under control to the front of your shoulders. Keep your core tight and do not lean back significantly – think of pressing the bar in a vertical path. This military press motion primarily works the anterior and medial delts, as well as the triceps, and is a key movement for upper-body strength.",
        videoUrl: "https://www.youtube.com/watch?v=GGpArq725ls",
        isPublic: true,
        muscleGroupId: "Shoulders",
        createdByUserId: null,
        
      },
      {
        name: "Dumbbell Lateral Raise",
        shortDescription: "Shoulder isolation exercise raising dumbbells out to the sides. Emphasizes the middle deltoid for wider shoulders.",
        description: "Stand with a dumbbell in each hand at your sides, palms facing inward. Keep a slight bend in your elbows. **Raise your arms out to the sides**, leading with your elbows until your upper arms are about parallel to the floor (hands around shoulder height):contentReference[oaicite:99]{index=99}. Your elbows should remain slightly higher than your wrists at the top. Pause briefly at shoulder level, feeling your shoulder muscles working, then slowly lower the weights back down to your sides. Avoid shrugging your shoulders up as you lift – keep them down and relaxed to isolate the delts. Also avoid using momentum; perform the raises in a controlled manner (it’s normal to use relatively light weights here). This exercise directly targets the lateral deltoid head, which helps create roundness and width in the shoulders.",
        videoUrl: "https://www.youtube.com/watch?v=0UoJdw-h7jw",
        isPublic: true,
        muscleGroupId: "Shoulders",
        createdByUserId: null,
        
      },
      {
        name: "Face Pull",
        shortDescription: "Pulling exercise using a rope on a cable, aimed at the rear shoulders and upper back. Helps improve posture and shoulder health.",
        description: "Attach a rope to a cable pulley at roughly face height. Grab the rope ends with an overhand grip (palms facing down or inward) and step back so there’s tension. Stand with a slight lean back. Begin with arms extended toward the pulley. Now **pull the rope directly toward your face**, driving your elbows out and back at about shoulder height:contentReference[oaicite:100]{index=100}. As you pull, externally rotate your shoulders so that your hands separate and come beside your ears (imagine doing a double-biceps pose with the rope). Squeeze your shoulder blades together at the end range. Then release the rope forward under control, re-extending your arms. Keep your upper body steady (no excessive leaning) and focus on the rear delts and mid-back contracting each rep. Face pulls strengthen the often-neglected rear deltoid and scapular muscles, balancing the shoulder and helping prevent injury from too much pressing.",
        videoUrl: "https://www.youtube.com/watch?v=REP0qH47W-w",
        isPublic: true,
        muscleGroupId: "Shoulders",
        createdByUserId: null,
        
      },
      {
        name: "Barbell Curl",
        shortDescription: "Standard biceps curl with a barbell. You lift the bar by bending your elbows, isolating the biceps muscles.",
        description: "Stand holding a barbell with an underhand grip (palms up), hands about shoulder-width apart. Your arms are extended down at your front thighs. Keep your **elbows tucked into your sides** and fixed there:contentReference[oaicite:101]{index=101}. Curl the bar up toward your chest by bending your elbows. Do not swing your torso or let your elbows drift forward – only the arms move. Continue curling until the bar is at roughly chest/shoulder level and your biceps are fully shortened. Squeeze the biceps at the top, then slowly lower the bar back down to the start with control. Fully straighten your arms at the bottom to get a complete stretch (but avoid relaxing completely between reps). Keep wrists in line with forearms (don’t let them excessively bend back). The barbell curl is a fundamental exercise for building biceps size and strength; proper form (no cheating) will maximize its effectiveness:contentReference[oaicite:102]{index=102}.",
        videoUrl: "https://www.youtube.com/watch?v=8k0lFDNroN4",
        isPublic: true,
        muscleGroupId: "Biceps",
        createdByUserId: null,
        
      },
      {
        name: "Hammer Curl",
        shortDescription: "Biceps curl variation with a neutral grip (thumbs up). Works the biceps along with the forearms (brachialis and brachioradialis).",
        description: "Stand with a dumbbell in each hand, arms at your sides and **palms facing each other** (neutral grip):contentReference[oaicite:103]{index=103}. Keep your elbows close to your body and fixed in place. Curl the dumbbells up by bending at the elbows, just like a regular curl, but maintaining that hammer (thumbs-up) hand position throughout. Bring the dumbbells toward your shoulders until your forearms are vertical and you feel a strong contraction in the upper arm. Lower the weights back down slowly until your arms are fully extended at your sides. Avoid using momentum or swinging your upper arms. The neutral grip shifts emphasis to the brachialis (a muscle beneath the biceps) and the brachioradialis (forearm), which helps build arm thickness and forearm strength. Hammer curls can typically be done with slightly heavier weight than standard curls, but form should remain strict.",
        videoUrl: "https://www.youtube.com/watch?v=zC3nLlEvin4",
        isPublic: true,
        muscleGroupId: "Biceps",
        createdByUserId: null,
        
      },
      {
        name: "Close-Grip Bench Press",
        shortDescription: "Bench press using a narrow grip to emphasize the triceps. Similar to a regular bench, but hands closer and elbows tucked.",
        description: "Lie on the bench and grasp the barbell with your hands about shoulder-width apart (narrower than a normal bench press). Keep your elbows drawn in toward your torso as you lower the bar. Aim to touch the bar to your lower chest or sternum, with your elbows staying close (you’ll feel your triceps loading heavily):contentReference[oaicite:104]{index=104}. Press the bar back up by extending your arms, focusing on pushing with your triceps. Do not allow your elbows to flare out excessively – keeping them tucked will maximize triceps engagement. Use the same general form cues as the standard bench press: shoulder blades retracted, feet planted for stability, and a controlled tempo. The close-grip bench is great for building strength in the triceps while still involving the chest and shoulders to a degree.",
        videoUrl: "https://www.youtube.com/watch?v=m_N6Gupz0h8",
        isPublic: true,
        muscleGroupId: "Triceps",
        createdByUserId: null,
        
      },
      {
        name: "Dip (Triceps Version)",
        shortDescription: "Parallel bar dip focusing on triceps. Performed upright, dipping down and pressing up using the back of the arms.",
        description: "Grasp parallel dip bars and support your body with arms straight. For triceps emphasis, keep your torso **vertical** (do not lean far forward) and your elbows pointing backward. Begin the dip by bending your elbows to lower yourself. Go down until your upper arms are about parallel to the floor (or as far as comfortable without shoulder strain). Throughout the descent, **keep your elbows tucked in** close to your sides:contentReference[oaicite:105]{index=105}. You should feel a stretch in your chest/shoulders and tension in your triceps at the bottom. Press back up by straightening your arms, returning to the top position without locking your elbows harshly. Maintain control – avoid swinging or kipping with your legs. If bodyweight is too challenging, use an assisted dip machine or bands. Dips are a compound movement; the upright, elbows-in form makes the triceps do most of the work, strongly stimulating the triceps’ long head:contentReference[oaicite:106]{index=106}.",
        videoUrl: "https://www.youtube.com/watch?v=wjUmnZH528Y",
        isPublic: true,
        muscleGroupId: "Triceps",
        createdByUserId: null,
        
      },
      {
        name: "Triceps Pushdown",
        shortDescription: "Isolation exercise for triceps using a cable. You push a bar or rope down by extending your elbows.",
        description: "Stand facing a high cable with a rope or bar attachment. Grab it with a firm grip (palms down if bar, neutral if rope) and bring your elbows to your sides, bent about 90°. Hold your chest up and **lean forward just slightly**, keeping your elbows tucked into your ribcage:contentReference[oaicite:107]{index=107}. Now push the attachment downward by straightening your arms. Focus on keeping your elbows stationary – only the forearms move. Push down until your arms are fully extended and your triceps are contracted (you can spread the rope ends apart at the bottom for a peak contraction). **Do not lock your elbows forcefully** or let them flare out:contentReference[oaicite:108]{index=108}. Then allow the weight to raise your hands back up with control until your elbows are ~90° again. Repeat for higher reps. This exercise isolates the triceps (all three heads), and the constant tension of the cable makes it ideal for muscle growth and endurance in the triceps.",
        videoUrl: "https://www.youtube.com/watch?v=2-LAMcpzODU",
        isPublic: true,
        muscleGroupId: "Triceps",
        createdByUserId: null,
        
      }
    ]
  });  

  const exercises2 = await prisma.exerciseTemplate.createMany({
    data: [
      // ──────────── QUADS ────────────
      {
        name: "Zercher Squat",
        shortDescription: "Front-loaded squat with the bar held in the crooks of the elbows—great for quads, core and upper-back strength.",
        description:
          "Cradle the barbell in the crook of your elbows, clasping hands together. Stand shoulder-width, chest up. Sit your hips down and back while keeping the torso as upright as possible. Descend until elbows brush the thighs, then drive through mid-foot to stand, bracing your core throughout. The front load forces an upright posture and hammers the quads while sparing the lower back.",
        videoUrl: "https://youtu.be/ZsN7O_OsqsE?t=15",
        isPublic: true,
        muscleGroupId: "Quads",
        createdByUserId: null
      },
      {
        name: "Cyclist (Heels-Elevated) Squat",
        shortDescription: "Narrow-stance, heels-raised back squat that maximises knee travel and isolates the quadriceps.",
        description:
          "Place your heels on a 2–4 inch wedge or plate, feet 4–6 inches apart, toes forward. With the bar high on your traps, brace and descend straight down, letting the knees travel well past the toes. Keep torso upright and sit as low as mobility allows. Drive up through the balls of the feet, maintaining heel contact on the wedge, to emphasize vastus medialis activation.",
        videoUrl: "https://youtu.be/yn6vFgM0gKs",
        isPublic: true,
        muscleGroupId: "Quads",
        createdByUserId: null
      },
      {
        name: "Sissy Squat",
        shortDescription: "Body-weight quad burner where you lean back and bend only at the knees, stretching the quads through a long range.",
        description:
          "Stand tall, rise onto your toes, and hinge from the knees while keeping hips extended—your body forms a straight line from knees to head as you lean back. Descend until you feel a deep quad stretch, then contract the quads to pull yourself upright. Hold onto a support at first; progress by going hands-free or using a dedicated sissy-squat stand.",
        videoUrl: "https://www.youtube.com/watch?v=lNfZix7_GgU",
        isPublic: true,
        muscleGroupId: "Quads",
        createdByUserId: null
      },
  
      // ──────────── HAMSTRINGS ────────────
      {
        name: "Single-Leg Romanian Deadlift",
        shortDescription: "Unilateral hip-hinge that stretches and strengthens each hamstring while challenging balance.",
        description:
          "Hold a dumbbell in the hand opposite the working leg. With a soft knee, hinge at the hip, letting the free leg extend straight behind you. Lower until the torso is nearly parallel to the floor and you feel a hamstring stretch, then drive the hip forward to stand. Keep hips square and the back flat; use light weight until balance is solid.",
        videoUrl: "https://youtu.be/ZGL_3x7-t-Y",
        isPublic: true,
        muscleGroupId: "Hamstrings",
        createdByUserId: null
      },
      {
        name: "Hamstring Slider Curl",
        shortDescription: "Floor curl using furniture sliders or towels—eccentric-focused hamstring work with minimal equipment.",
        description:
          "Lie supine with heels on sliders, knees bent, and hips bridged. Keeping hips high, extend your knees to slide the feet away until legs are nearly straight, then curl the heels back under you to return. To regress, perform only the eccentric phase and drop hips between reps. Maintain a neutral spine and avoid hip sag to keep tension on the hamstrings.",
        videoUrl: "https://youtu.be/e9HU5pK-bxI",
        isPublic: true,
        muscleGroupId: "Hamstrings",
        createdByUserId: null
      },
      {
        name: "Snatch-Grip Deadlift",
        shortDescription: "Wide-grip deadlift that increases range of motion and hamstring/glute recruitment.",
        description:
          "Take a snatch-width grip (bar rests in hip crease when standing). Set hips a bit lower than a conventional deadlift, chest tall, lats tight. Push through the floor and keep the bar close as you extend hips and knees. The longer pull and torso angle load the posterior chain heavily—use lighter percentages than your regular deadlift.",
        videoUrl: "https://www.youtube.com/watch?v=LIBTBSAAUWo",
        isPublic: true,
        muscleGroupId: "Hamstrings",
        createdByUserId: null
      },
  
      // ──────────── CALVES ────────────
      {
        name: "Donkey Calf Raise",
        shortDescription: "Hip-hinged calf raise that allows a deep stretch and heavy loading of the gastrocnemius.",
        description:
          "Bend at the hips about 90°, torso supported on a bench or pad, and place the balls of your feet on a step with a belt or machine pad over your hips. Lower heels for a full stretch, then drive up onto the toes, contracting hard at the top. The hip-hinge lengthens the gastrocnemius for a stronger contraction.",
        videoUrl: "https://youtu.be/-4G29pBMf-8",
        isPublic: true,
        muscleGroupId: "Calves",
        createdByUserId: null
      },
      {
        name: "Farmer’s Walk on Toes",
        shortDescription: "Loaded carry performed on tip-toes to blast the calves and improve foot/ankle stability.",
        description:
          "Grab two heavy dumbbells or farmer handles. Rise onto your toes and walk in short, controlled steps while maintaining elevation. Keep core braced and shoulders down. Walk for time or distance; if heels touch down, reset and continue. The constant plantar-flexion under load provides a potent hypertrophy and endurance stimulus for the calves.",
        videoUrl: "https://youtu.be/IcP9iGvYO38",
        isPublic: true,
        muscleGroupId: "Calves",
        createdByUserId: null
      },
  
      // ──────────── GLUTES ────────────
      {
        name: "Single-Leg Hip Thrust",
        shortDescription: "Unilateral hip thrust that isolates each glute and identifies side-to-side imbalances.",
        description:
          "Set up like a regular hip thrust but keep one foot on the floor and the other leg extended. Drive the working heel into the ground, lifting hips until the torso is parallel to the floor. Squeeze the working glute at the top, then lower with control. Avoid letting the pelvis twist—keep it square by bracing the core.",
        videoUrl: "https://www.youtube.com/watch?v=lzDgRRuBdqY",
        isPublic: true,
        muscleGroupId: "Glutes",
        createdByUserId: null
      },
      {
        name: "Frog Pump",
        shortDescription: "High-rep, body-weight hip-thrust variant targeting upper-outer glutes via frog-leg foot position.",
        description:
          "Lie on your back, soles of the feet together and knees flared (butterfly position). With arms braced at your sides, thrust hips upward by squeezing the glutes, then lower and repeat in a pumping motion. Keep the range modest and tension constant—perfect as a burnout or activation drill.",
        videoUrl: "https://youtu.be/Qf-QyAR59mM?t=60",
        isPublic: true,
        muscleGroupId: "Glutes",
        createdByUserId: null
      },
      {
        name: "Curtsy Lunge",
        shortDescription: "Diagonal reverse lunge crossover that trains glute medius and adductors while challenging balance.",
        description:
          "From standing, step one leg back and across behind the other, lowering into a lunge until the rear knee nearly touches the floor. Keep torso upright and front knee tracking over toes. Push through the front heel to return. Alternate sides. The crossover line of pull engages the side-glute fibers and improves hip stability.",
        videoUrl: "https://youtu.be/0MZd3iKzzPM?t=45",
        isPublic: true,
        muscleGroupId: "Glutes",
        createdByUserId: null
      },
  
      // ──────────── ABS / CORE ────────────
      {
        name: "Pallof Press",
        shortDescription: "Anti-rotation cable press that trains core stability by resisting torso twist.",
        description:
          "Set a cable at chest height, stand sideways to the stack, and hold the handle at your sternum. Brace and press the handle straight out, arms extended, without allowing the torso to rotate toward the weight. Hold 1-2 s, return, and repeat before switching sides. Maintain neutral spine and even hips; increase distance for more tension.",
        videoUrl: "https://youtu.be/0j-g-G-9L3M0",
        isPublic: true,
        muscleGroupId: "Abs",
        createdByUserId: null
      },
      {
        name: "Side Plank",
        shortDescription: "Isometric hold on one forearm and the side of the foot—targets obliques and lateral core stabilisers.",
        description:
          "Lie on one side, forearm under shoulder, feet stacked. Lift hips so the body forms a straight line head-to-heels. Keep shoulders and hips square and neck neutral. Hold for time without letting the hips sag. To progress, raise the top leg or add a weight plate on the hip.",
        videoUrl: "https://youtu.be/psjhvt5QZ6M?t=20",
        isPublic: true,
        muscleGroupId: "Abs",
        createdByUserId: null
      },
      {
        name: "Dead Bug",
        shortDescription: "Contralateral arm/leg lowering drill that teaches core bracing and lumbar-spine control.",
        description:
          "Lie supine with arms straight up and hips/knees at 90°. Flatten lower back into the floor. Extend the opposite arm and leg toward the ground without losing lumbar contact. Return to start and alternate. Move slowly; the goal is zero pelvic tilt as limbs move, engraining proper bracing mechanics.",
        videoUrl: "https://youtu.be/IuM-8H-QJ-so",
        isPublic: true,
        muscleGroupId: "Abs",
        createdByUserId: null
      },
  
      // ──────────── BACK ────────────
      {
        name: "Pendlay Row",
        shortDescription: "Explosive barbell row off the floor each rep, emphasising lat and mid-back strength from a dead stop.",
        description:
          "Set up like a conventional bent-over row but with torso parallel to the floor and the bar resting on the ground. Brace hard, then pull the bar explosively to the lower chest, pausing briefly, and return it to the floor each rep. Reset back angle before every pull to enforce strictness and build starting strength.",
        videoUrl: "https://youtu.be/Ry-h-Zic-gQw",
        isPublic: true,
        muscleGroupId: "Back",
        createdByUserId: null
      },
      {
        name: "Chest-Supported Dumbbell Row",
        shortDescription: "Row performed prone on an incline bench—eliminates lower-back strain and isolates lats and rhomboids.",
        description:
          "Lie face-down on a 30–45° incline bench, dumbbells hanging straight down. Retract scapulae, then pull the bells toward your lower ribs, elbows tracking about 30° from the torso. Squeeze the back muscles, then lower under control until arms are straight. No body English—let the bench support your torso so the mid-back does all the work.",
        videoUrl: "https://youtu.be/4-QMBT-v-bqI",
        isPublic: true,
        muscleGroupId: "Back",
        createdByUserId: null
      },
      {
        name: "Straight-Arm Lat Pulldown",
        shortDescription: "Cable pull executed with locked elbows to isolate the lats through shoulder extension.",
        description:
          "Attach a straight bar to a high cable. Stand tall, slight forward hinge, arms straight. Pull the bar in an arc down to your thighs by driving the upper arms back, keeping elbows locked. Feel the lats contract, then return slowly to the overhead stretch. Avoid using triceps or swinging the torso; movement should come from the shoulders alone.",
        videoUrl: "https://youtu.be/KO0LE-q-N8I",
        isPublic: true,
        muscleGroupId: "Back",
        createdByUserId: null
      },
  
      // ──────────── CHEST ────────────
      {
        name: "Dumbbell Pullover",
        shortDescription: "Classic stretch-focused chest & serratus move performed supine across a bench.",
        description:
          "Lie across a bench so only shoulders rest on it, hips low, forming a bridge. Hold a single dumbbell over the chest with both hands under the inner plate. Keeping arms nearly straight, lower the weight in an arc behind your head until you feel a big stretch in chest and lats. Raise the dumbbell back over the chest by contracting the pecs and lats. Control range to shoulder comfort.",
        videoUrl: "https://youtu.be/aS2-x-R-myBA",
        isPublic: true,
        muscleGroupId: "Chest",
        createdByUserId: null
      },
      {
        name: "Low-to-High Cable Fly",
        shortDescription: "Upward cable fly that biases the upper chest fibres by moving from hip height to eye level.",
        description:
          "Set both pulleys to the lowest position. With slight forward lean, palms forward, sweep the handles up and across the body in a diagonal arc, finishing with hands at upper-chest height. Keep elbows softly bent and shoulders down. Squeeze the upper chest at the top, then lower with control for a stretch before the next rep.",
        videoUrl: "https://youtu.be/bOyv-JDnPqI",
        isPublic: true,
        muscleGroupId: "Chest",
        createdByUserId: null
      },
      {
        name: "Weighted Push-Up",
        shortDescription: "Push-up with external load (plate or vest) to progress beyond body-weight for chest and triceps strength.",
        description:
          "Set up in a standard push-up position, hands slightly wider than shoulders, core tight. Have a partner place a weight plate on the mid-upper back or wear a vest. Lower until the chest nearly touches the floor, elbows at ~45°, then press back up to full lock-out. Keep hips level throughout. Choose a load that lets you hit 5–15 tough reps with good form.",
        videoUrl: "https://youtu.be/f3j-jqe-q-sI",
        isPublic: true,
        muscleGroupId: "Chest",
        createdByUserId: null
      },
  
      // ──────────── SHOULDERS ────────────
      {
        name: "Landmine Press",
        shortDescription: "Angled overhead press using a barbell landmine—shoulder-friendly path hitting front delts and serratus.",
        description:
          "Slide a barbell into a landmine sleeve or corner. Hold the free end in one hand at shoulder height, stance staggered. Press the bar up and slightly forward until arm is extended; resist shrugging. Lower under control to the starting position and repeat. Switch arms after set. The 45° path reduces shoulder impingement and trains pressing power.",
        videoUrl: "https://youtu.be/1jJioiz2s2g?t=105",
        isPublic: true,
        muscleGroupId: "Shoulders",
        createdByUserId: null
      },
      {
        name: "Upright Row (Cable or Barbell)",
        shortDescription: "Vertical pull that targets upper traps and lateral delts—performed with moderate grip width.",
        description:
          "Grasp a bar or cable handle with hands slightly inside shoulder width. Stand tall, shoulders back. Pull the bar straight up along the torso, leading with the elbows until they reach shoulder height; wrists stay below elbows. Pause, then lower slowly. Avoid excessive internal rotation by keeping elbows no higher than shoulder level and using a medium grip.",
        videoUrl: "https://youtu.be/9oy-HrSyjLk",
        isPublic: true,
        muscleGroupId: "Shoulders",
        createdByUserId: null
      },
      {
        name: "Y-Raise",
        shortDescription: "Light-weight movement hitting lower traps & rear delts, improving scapular upward rotation.",
        description:
          "Lie prone on an incline bench set to ~30°, light dumbbells in hand. With thumbs up, raise arms overhead in a 30° ‘Y’ out from the body until in line with ears. Squeeze lower-mid traps, then lower with control. Keep neck neutral and avoid shrugging. Perfect for shoulder-health supersets or warm-ups.",
        videoUrl: "https://youtu.be/MX0-r-8xPgtk",
        isPublic: true,
        muscleGroupId: "Shoulders",
        createdByUserId: null
      },
  
      // ──────────── BICEPS ────────────
      {
        name: "Spider Curl",
        shortDescription: "Chest-supported curl on an incline bench—elbows forward for maximal biceps isolation.",
        description:
          "Lie prone on a steep incline bench with arms hanging straight down, dumbbells in a supinated grip. Curl the weight toward your shoulders without swinging, keeping upper arms perpendicular to the floor. Squeeze at the top, then lower fully. The fixed elbow position removes torso momentum and keeps tension squarely on the biceps.",
        videoUrl: "https://youtu.be/-cPQS-C5fEs",
        isPublic: true,
        muscleGroupId: "Biceps",
        createdByUserId: null
      },
      {
        name: "Bayesian Cable Curl",
        shortDescription: "Cable curl with arm slightly behind the body, biasing the biceps long head through maximal stretch.",
        description:
          "Set a single cable at low position. Stand facing away, cable in the hand of the forward arm, step out to keep constant tension. Arm starts extended and slightly behind torso. Curl the hand toward the shoulder, keeping elbow back. Squeeze, then lower under control until fully stretched. Maintain body still; only the elbow flexes.",
        videoUrl: "https://youtu.be/5-QFp-kN-yj0",
        isPublic: true,
        muscleGroupId: "Biceps",
        createdByUserId: null
      },
      {
        name: "Drag Curl",
        shortDescription: "Barbell curl variant where the bar is ‘dragged’ up the torso—keeps elbow back to emphasise the biceps peak.",
        description:
          "Hold a barbell with shoulder-width supinated grip. Instead of raising elbows forward, keep them back and ‘drag’ the bar up your body by flexing the elbows, bar staying in contact with torso until it reaches upper abs. Squeeze biceps, then lower bar down the same path. The rear elbow position shortens the long head for a unique stimulus.",
        videoUrl: "https://youtu.be/IcUu-sADINM",
        isPublic: true,
        muscleGroupId: "Biceps",
        createdByUserId: null
      },
  
      // ──────────── TRICEPS ────────────
      {
        name: "Overhead Cable Rope Extension",
        shortDescription: "Standing overhead triceps extension using a rope to bias the long head through full stretch.",
        description:
          "Attach a rope to the low pulley. Face away, step forward, and press the rope overhead until arms are straight. Keeping elbows close to your head, flex only the elbows to lower the rope behind until forearms touch biceps, then extend back to lockout, spreading the rope ends apart at the top for extra contraction.",
        videoUrl: "https://youtu.be/9CK-Azh-QsM",
        isPublic: true,
        muscleGroupId: "Triceps",
        createdByUserId: null
      },
      {
        name: "JM Press",
        shortDescription: "Hybrid between close-grip bench and skull-crusher—excellent for triceps strength near lock-out.",
        description:
          "Lie on a bench with a shoulder-width grip. Lower the bar by bringing elbows forward (like a skull-crusher) but allow bar to travel to just above chin/throat. Elbows stay at ~45° from torso. From this mid-range position, press the bar back up by extending the elbows. Use moderate loads and controlled tempo to spare elbows and shoulders.",
        videoUrl: "https://youtu.be/Nh-aoeo-VrXM",
        isPublic: true,
        muscleGroupId: "Triceps",
        createdByUserId: null
      },
      {
        name: "Close-Grip Push-Up",
        shortDescription: "Push-up performed with hands directly under the shoulders to maximise triceps engagement.",
        description:
          "Adopt a push-up position but place hands only 6–8 inches apart under your chest. Keep elbows tucked close as you lower until chest nearly touches hands, then press back up to full elbow extension. Maintain a straight line head-to-heels. Add weight via a vest or plates on the back once body-weight reps exceed 20.",
        videoUrl: "https://youtu.be/F-rsPe2pD8o",
        isPublic: true,
        muscleGroupId: "Triceps",
        createdByUserId: null
      }
    ]
  });
  

}

main();
  


  
