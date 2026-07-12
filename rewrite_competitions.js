const fs = require('fs');
const content = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Competitions — Fulshear HS TSA</title>
  <link rel="stylesheet" href="assets/css/styles.css?v=20260709b">
</head>
<body>
  <div class="scroll-banner">
    <div class="scroll-track" aria-hidden="true">
      <div class="scroll-text">FULSHEAR HIGH SCHOOL TECHNOLOGY STUDENT ASSOCIATION • FULSHEAR HIGH SCHOOL TECHNOLOGY STUDENT ASSOCIATION • FULSHEAR HIGH SCHOOL TECHNOLOGY STUDENT ASSOCIATION •</div>
      <div class="scroll-text">FULSHEAR HIGH SCHOOL TECHNOLOGY STUDENT ASSOCIATION • FULSHEAR HIGH SCHOOL TECHNOLOGY STUDENT ASSOCIATION • FULSHEAR HIGH SCHOOL TECHNOLOGY STUDENT ASSOCIATION •</div>
    </div>
  </div>
  <div class="header-container">
    <header class="site-header">
      <nav class="main-nav">
        <a href="index.html" class="nav-btn">Home</a>
        <a href="about.html" class="nav-btn">About TSA</a>
        <a href="officers.html" class="nav-btn">Club Officers</a>
      </nav>
      <div class="logo-section">
        <a href="index.html" class="logo-link" aria-label="Fulshear HS TSA home">
          <img src="assets/img/fulshear-logo.png" alt="Fulshear HS TSA logo" class="logo">
        </a>
      </div>
      <nav class="main-nav">
        <a href="competitions.html" class="nav-btn">Competitions</a>
        <a href="howto.html" class="nav-btn">How to Join</a>
        <div class="nav-dropdown">
          <button class="dropdown-btn">More ▼</button>
          <div class="dropdown-menu">
            <a href="archive.html">Event Archive</a>
            <a href="gallery.html">Gallery</a>
            <a href="slides.html">Meeting Slides</a>
            <a href="resources.html">Resources</a>
          </div>
        </div>
      </nav>
    </header>
  </div>
  <main>
    <h1>Competitions</h1>
    <p>Explore 40 TSA competitions with a quick summary, each topic’s theme, challenge, and a placeholder image.</p>
    <section class="competitions-section">
      <div class="competitions-list" id="competitions-list"></div>
    </section>
  </main>
  <footer class="site-footer" id="site-footer">
    <div class="footer-grid">
      <div class="footer-column">
        <div class="footer-title">Contact Us</div>
        <div class="footer-contact-block">
          <a class="footer-donate" href="https://www.gofundme.com" target="_blank" rel="noreferrer">Donate</a>
          <div class="footer-copy">
            <strong>Location:</strong> 9302 Charger Way, Fulshear, TX 77441<br>
            <strong>Officer Email:</strong> tsacfhs@gmail.com<br>
            <strong>Advisor Email:</strong> dmatheson@lcisd.org<br>
            <strong>Advisor Room:</strong> 1664
          </div>
          <div class="social-icons">
            <a class="social-icon" href="https://www.instagram.com/fulshear.tsa/" target="_blank" rel="noreferrer" aria-label="Instagram"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.33 3.608 1.305.975.975 1.243 2.242 1.305 3.608.058 1.266.069 1.646.069 4.85s-.012 3.584-.069 4.85c-.062 1.366-.33 2.633-1.305 3.608-.975.975-2.242 1.243-3.608 1.305-1.266.058-1.646.069-4.85.069s-3.584-.012-4.85-.069c-1.366-.062-2.633-.33-3.608-1.305-.975-.975-1.243-2.242-1.305-3.608C2.175 15.747 2.163 15.367 2.163 12s.012-3.584.069-4.85c.062-1.366.33-2.633 1.305-3.608C4.512 2.493 5.779 2.225 7.145 2.163 8.411 2.105 8.791 2.094 12 2.094zm0-2.163C8.741 0 8.332.013 7.052.072 5.768.131 4.677.346 3.758.896c-.92.55-1.7 1.33-2.25 2.25C1.346 4.677 1.131 5.768 1.072 7.052.013 8.332 0 8.741 0 12c0 3.259.013 3.668.072 4.948.059 1.284.274 2.375.896 3.294.55.92 1.33 1.7 2.25 2.25.919.622 2.01.837 3.294.896C8.332 23.987 8.741 24 12 24s3.668-.013 4.948-.072c1.284-.059 2.375-.274 3.294-.896.92-.55 1.7-1.33 2.25-2.25.622-.919.837-2.01.896-3.294.059-1.28.072-1.689.072-4.948s-.013-3.668-.072-4.948c-.059-1.284-.274-2.375-.896-3.294-.55-.92-1.33-1.7-2.25-2.25-.919-.622-2.01-.837-3.294-.896C15.668.013 15.259 0 12 0zm0 5.838A6.162 6.162 0 0 0 5.838 12 6.162 6.162 0 0 0 12 18.162 6.162 6.162 0 0 0 18.162 12 6.162 6.162 0 0 0 12 5.838zm0 10.162A3.999 3.999 0 1 1 16 12a3.999 3.999 0 0 1-4 4zm6.406-11.845a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z"/></svg></a>
            <a class="social-icon" href="https://www.facebook.com/fulshear.tsa" target="_blank" rel="noreferrer" aria-label="Facebook"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M22.675 0h-21.35C.596 0 0 .593 0 1.326v21.348C0 23.407.596 24 1.326 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.895-4.788 4.662-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.796.715-1.796 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.404 24 24 23.407 24 22.674V1.326C24 .593 23.404 0 22.675 0z"/></svg></a>
          </div>
        </div>
      </div>
      <div class="footer-column">
        <div class="footer-title">Send a Message</div>
        <form class="contact-form" id="contact-form">
          <input type="text" name="name" placeholder="Your name" required>
          <input type="email" name="email" placeholder="Your email" required>
          <textarea name="message" placeholder="What would you like to ask us?" required></textarea>
          <button type="submit">Send Message</button>
          <div class="form-status" aria-live="polite"></div>
        </form>
      </div>
      <div class="footer-column footer-map-column">
        <div class="footer-title">Our Location</div>
        <div class="map-wrap">
          <iframe src="https://maps.google.com/maps?q=Fulshear%20Churchill%20High%20School&t=&z=15&ie=UTF8&iwloc=&output=embed" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
        </div>
      </div>
    </div>
  </footer>
  <script>
    const competitions = [
      { title: 'Animatronics', description: 'Teams design, build, and program a mechanical display that tells a story through motion and control.', theme: 'Animated engineering and creative automation.', problem: 'Create an interactive animatronics tableau that showcases precision movement and mechanical storytelling.', imageLabel: 'Animatronics example photo' },
      { title: 'Architecture Design', description: 'Students create a building design that balances innovation, sustainability, and structural integrity.', theme: 'Smart spaces for modern communities.', problem: 'Develop an architectural solution for a community facility that blends function with sustainable design.', imageLabel: 'Architecture example photo' },
      { title: 'Biotechnology Design', description: 'Competitors research biological solutions and present an engineered biotech product or service.', theme: 'Health and environment through biotechnology.', problem: 'Design a biotechnology system to address a real-world health or environmental need.', imageLabel: 'Biotechnology example photo' },
      { title: 'Career Prep', description: 'Students interview and demonstrate professional skills in a mock career-planning environment.', theme: 'Professional readiness for STEM careers.', problem: 'Showcase polished interview skills and a strong personal career plan for a technology career.', imageLabel: 'Career prep example photo' },
      { title: 'Community Service Video', description: 'A team creates a short film promoting a technology-oriented community service project.', theme: 'Inspiring service through storytelling.', problem: 'Produce a compelling video that highlights how TSA service impacts students and the community.', imageLabel: 'Community service example photo' },
      { title: 'Computer-Aided Design', description: 'Participants use CAD software to design a functional product or system.', theme: 'Precision design for real-world manufacturing.', problem: 'Deliver a technical CAD model with a professional presentation of the design intent.', imageLabel: 'CAD example photo' },
      { title: 'Crime Busters', description: 'Teams solve a forensic mystery using logic, evidence, and scientific reasoning.', theme: 'Investigative science meets problem solving.', problem: 'Determine which suspect committed the crime using evidence analysis and deduction.', imageLabel: 'Forensics example photo' },
      { title: 'Debating Technological Issues', description: 'Students debate a technology-related issue using persuasive reasoning and evidence.', theme: 'Critical thinking in technology policy.', problem: 'Defend a position on the impact of emerging technology in society.', imageLabel: 'Debate example photo' },
      { title: 'Digital Video Production', description: 'Teams produce a short digital video showcasing creativity, storytelling, and technical skill.', theme: 'Video media for communication excellence.', problem: 'Create a polished video that communicates a clear message with strong production quality.', imageLabel: 'Video production example photo' },
      { title: 'Dragster Design', description: 'Teams design a dragster vehicle and analyze its performance for speed and safety.', theme: 'Rapid design for competitive motion.', problem: 'Develop a dragster design that balances acceleration with control and safety.', imageLabel: 'Dragster example photo' },
      { title: 'Electrical Applications', description: 'Competitors complete hands-on electrical tasks and demonstrate circuit knowledge.', theme: 'Power systems and practical wiring skills.', problem: 'Build and troubleshoot circuits to meet a defined electrical objective.', imageLabel: 'Electrical example photo' },
      { title: 'Environmental Sustainability', description: 'Students develop a sustainable solution that minimizes environmental impact.', theme: 'Balanced technology for a greener future.', problem: 'Design a project that solves an environmental challenge using sustainable design principles.', imageLabel: 'Sustainability example photo' },
      { title: 'Engineering Design', description: 'Teams engineer a device or system to solve a real-world engineering challenge.', theme: 'Innovation through engineered solutions.', problem: 'Produce an engineered prototype that demonstrates creativity and feasibility.', imageLabel: 'Engineering example photo' },
      { title: 'Extemporaneous Speech', description: 'Students prepare and deliver a speech on a new technology topic with little preparation.', theme: 'Communicating tech ideas under pressure.', problem: 'Present a polished talk on a technology issue using evidence and strong delivery.', imageLabel: 'Speech example photo' },
      { title: 'Flight Endurance', description: 'Teams build a model aircraft designed to stay aloft for the maximum time.', theme: 'Sustained flight through aerodynamic design.', problem: 'Create a glider or powered model that maximizes flight duration under competition rules.', imageLabel: 'Flight example photo' },
      { title: 'Forensic Science', description: 'Participants solve a scientific mystery using observation and analytical skills.', theme: 'Evidence-based reasoning in crime science.', problem: 'Analyze evidence and make accurate conclusions about a staged forensic scenario.', imageLabel: 'Forensics example photo' },
      { title: 'Future Technology Teacher', description: 'Students demonstrate teaching and leadership skills by delivering an engaging lesson.', theme: 'Sharing STEM knowledge with confidence.', problem: 'Design and teach a short lesson that effectively explains a technical concept.', imageLabel: 'Teaching example photo' },
      { title: 'Geospatial Technology', description: 'Teams map and analyze spatial data to solve a geographic challenge.', theme: 'Location intelligence for real-world problems.', problem: 'Use geospatial tools to make decisions from mapping data.', imageLabel: 'Geospatial example photo' },
      { title: 'Improvisational Team', description: 'Groups identify a problem and quickly develop a feasible solution together.', theme: 'Creative teamwork in rapid design.', problem: 'Respond to a surprise challenge with a practical and well-communicated solution.', imageLabel: 'Improv example photo' },
      { title: 'Inventions and Innovations', description: 'Students pitch a new product or service that addresses a real need.', theme: 'Entrepreneurial design for technology impact.', problem: 'Create a viable invention concept with clear benefits and implementation plan.', imageLabel: 'Invention example photo' },
      { title: 'Medical Technology', description: 'Teams develop a medical device or healthcare improvement solution.', theme: 'Health innovation through engineering.', problem: 'Design a medical technology concept that improves patient care or health outcomes.', imageLabel: 'Medical example photo' },
      { title: 'Microcontroller Design', description: 'Students program and build an embedded system using microcontroller hardware.', theme: 'Smart control systems in action.', problem: 'Create an automated device using sensors, microcontroller logic, and outputs.', imageLabel: 'Microcontroller example photo' },
      { title: 'Mobile Robotics', description: 'Teams build and code a robot to complete tasks autonomously.', theme: 'Robotics for flexible real-world missions.', problem: 'Develop a mobile robot that navigates a course and completes mission tasks.', imageLabel: 'Robotics example photo' },
      { title: 'On Demand Video', description: 'Competitors create a polished promotional video under time constraints.', theme: 'Rapid storytelling with media production.', problem: 'Produce a compelling short video that supports a TSA message or theme.', imageLabel: 'On-demand video example photo' },
      { title: 'Photographic Technology', description: 'Students capture and edit images to create a strong visual message.', theme: 'Visual storytelling through photography.', problem: 'Deliver a photo series that tells a clear technology-focused story.', imageLabel: 'Photography example photo' },
      { title: 'Prepared Speech', description: 'Students deliver a rehearsed speech on a technical topic with clarity and confidence.', theme: 'Prepared public speaking in STEM.', problem: 'Communicate a technology issue effectively using a structured speech.', imageLabel: 'Prepared speech example photo' },
      { title: 'Promotional Graphics', description: 'Teams design graphics that promote a TSA event or campaign.', theme: 'Branding and visual communication.', problem: 'Create a compelling graphic package that promotes a technology event.', imageLabel: 'Graphics example photo' },
      { title: 'Programming', description: 'Students solve coding problems and demonstrate software development thinking.', theme: 'Software solutions for technology challenges.', problem: 'Write a working program that solves a technical problem efficiently.', imageLabel: 'Programming example photo' },
      { title: 'Public Service Announcement', description: 'Competitors write and produce a PSA for a technology awareness topic.', theme: 'Public outreach through media messaging.', problem: 'Create a short PSA that educates the public on a technology issue.', imageLabel: 'PSA example photo' },
      { title: 'Structural Engineering', description: 'Teams design a structure that can support weight and withstand forces.', theme: 'Strength and stability in engineered design.', problem: 'Create a model structure that meets performance criteria for strength and economy.', imageLabel: 'Structure example photo' },
      { title: 'System Control Technology', description: 'Students build or simulate systems that control mechanical or electrical processes.', theme: 'Automated systems and smart controls.', problem: 'Design a control system that manages a process reliably and safely.', imageLabel: 'Control example photo' },
      { title: 'Technology Bowl', description: 'Teams answer rapid-fire questions about technology and engineering concepts.', theme: 'Knowledge mastery in tech fundamentals.', problem: 'Demonstrate broad technology knowledge under timed competition conditions.', imageLabel: 'Bowl example photo' },
      { title: 'Technology Problem Solving', description: 'Teams analyze problems and propose logical solutions using technology principles.', theme: 'Analytical problem solving under pressure.', problem: 'Solve a series of technical problems with clear reasoning and teamwork.', imageLabel: 'Problem solving example photo' },
      { title: 'Transportation Modeling', description: 'Students design transportation solutions that address efficiency, safety, and sustainability.', theme: 'Future mobility engineering.', problem: 'Propose a transportation design that improves movement while reducing environmental impact.', imageLabel: 'Transportation example photo' },
      { title: 'UAV Drone Design', description: 'Teams design a drone system and explain how it supports a mission objective.', theme: 'Aerial technology for modern challenges.', problem: 'Develop a UAV concept for a practical aerial application.', imageLabel: 'Drone example photo' },
      { title: 'STEM Animation', description: 'Students create an animated media piece that explains a STEM topic clearly.', theme: 'Animated storytelling for STEM learning.', problem: 'Produce an educational animation that makes a technology concept easy to understand.', imageLabel: 'Animation example photo' },
      { title: 'Urban Search and Rescue', description: 'Teams design search and rescue solutions for urban disaster scenarios.', theme: 'Resilient rescue technology.', problem: 'Create a strategy and design for locating and rescuing survivors in a simulated disaster.', imageLabel: 'Rescue example photo' },
      { title: 'Video Game Design', description: 'Competitors design and pitch an original educational game concept that teaches STEM ideas.', theme: 'Interactive learning through games.', problem: 'Create a video game concept that teaches a STEM idea while engaging players.', imageLabel: 'Game design example photo' },
      { title: 'Technical Sketch', description: 'Students produce a series of technical sketches that communicate engineering concepts.', theme: 'Drawing precision for engineering communication.', problem: 'Deliver detailed sketches that clearly describe a mechanical or architectural solution.', imageLabel: 'Sketch example photo' },
      { title: 'Webmaster', description: 'Teams build and present a website that showcases TSA content or event promotion.', theme: 'Online communication for TSA chapter success.', problem: 'Create a dynamic website that highlights TSA programs, events, or chapter purpose.', imageLabel: 'Webmaster example photo' }
    ];

    function createCompetitionItem(item) {
      const article = document.createElement('article');
      article.className = 'competition-box';

      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'competition-summary';
      button.innerHTML = `<span class="competition-title">${item.title}</span><span class="competition-toggle">+</span>`;
      article.appendChild(button);

      const details = document.createElement('div');
      details.className = 'competition-details';
      details.innerHTML = `
        <div class="competition-details-inner">
          <div class="competition-detail-text">
            <p><strong>Description</strong> ${item.description}</p>
            <p><strong>Theme</strong> ${item.theme}</p>
            <p><strong>Problem</strong> ${item.problem}</p>
          </div>
          <div class="competition-image">${item.imageLabel}</div>
        </div>
      `;
      article.appendChild(details);

      button.addEventListener('click', () => {
        const isOpen = article.classList.toggle('open');
        button.querySelector('.competition-toggle').textContent = isOpen ? '-' : '+';
      });

      return article;
    }

    document.addEventListener('DOMContentLoaded', () => {
      const list = document.getElementById('competitions-list');
      competitions.forEach((item) => list.appendChild(createCompetitionItem(item)));
    });
  </script>
  <script src="assets/js/main.js?v=20260709b"></script>
</body>
</html>`;
fs.writeFileSync('competitions.html', content, 'utf8');
const text = fs.readFileSync('competitions.html', 'utf8');
console.log('items', (text.match(/\{ title: '/g) || []).length);
console.log('toggle', (text.match(/competition-toggle/g) || []).length);
console.log('box', (text.match(/class="competition-box"/g) || []).length);
`