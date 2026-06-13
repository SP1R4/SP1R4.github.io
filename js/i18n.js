// Lightweight i18n. Auto-detects from navigator.language; user choice
// persists in localStorage. Apply via data-i18n="key" / data-i18n-attr-aria-label="key".

(function () {
  const SUPPORTED = ['en', 'el'];

  const TRANSLATIONS = {
    en: {
      // Nav
      'nav.services': 'Services',
      'nav.projects': 'Projects',
      'nav.blog': 'Blog',
      'nav.toggleMenu': 'Toggle menu',
      'nav.toggleTheme': 'Toggle theme',
      'nav.toggleLang': 'Toggle language',
      'nav.main': 'Main navigation',

      // Index
      'index.section.connect': 'Connect',

      // Services page
      'services.title': 'Services',
      'services.subtitle': 'Cybersecurity & IT Consulting',
      'services.intro': 'I work with businesses and individuals to identify security weaknesses, harden infrastructure, and build reliable systems. Based in Crete, available remotely worldwide.',
      'services.section.offer': 'What I offer',
      'services.section.certs': 'Certifications',
      'services.section.credentials': 'Credentials',
      'services.pentest.title': 'Penetration Testing',
      'services.pentest.desc': 'Simulated attacks against your web applications, networks, and infrastructure to find vulnerabilities before real attackers do.',
      'services.pentest.i1': 'Web application testing',
      'services.pentest.i2': 'Network pentesting',
      'services.pentest.i3': 'API security',
      'services.pentest.i4': 'Wireless assessments',
      'services.pentest.i5': 'Social engineering',
      'services.audit.title': 'Security Audits',
      'services.audit.desc': 'Comprehensive review of your security posture, configurations, policies, and code to identify risks and compliance gaps.',
      'services.audit.i1': 'Configuration review',
      'services.audit.i2': 'Code audit',
      'services.audit.i3': 'Cloud security',
      'services.audit.i4': 'Compliance checks',
      'services.audit.i5': 'Risk assessment',
      'services.it.title': 'IT Infrastructure & Automation',
      'services.it.desc': 'Design and implementation of backup systems, monitoring, deployment pipelines, and custom automation tools.',
      'services.it.i1': 'Backup & disaster recovery',
      'services.it.i2': 'Server hardening',
      'services.it.i3': 'CI/CD pipelines',
      'services.it.i4': 'Monitoring & alerting',
      'services.it.i5': 'Custom tooling',
      'services.consulting.title': 'IT Consulting',
      'services.consulting.desc': 'Technical guidance on architecture decisions, technology selection, network design, and security strategy for your organization.',
      'services.consulting.i1': 'Architecture review',
      'services.consulting.i2': 'Network design',
      'services.consulting.i3': 'Technology selection',
      'services.consulting.i4': 'Security strategy',
      'services.consulting.i5': 'Incident response planning',
      'services.starlink.title': 'Starlink Installation & Managed Connectivity',
      'services.starlink.badge': 'Most requested',
      'services.starlink.desc': "Reliable internet where fixed lines can't reach — rural sites, villas, worksites, and businesses that need a resilient backup link. I handle the full deployment and wire it into MikroTik multi-WAN failover, VLANs, VPN and monitoring, so the connection stays up and secure — from site survey to ongoing remote management.",
      'services.starlink.i1': 'Multi-WAN failover (Starlink + 4G/DSL)',
      'services.starlink.i2': 'Site survey & obstruction check',
      'services.starlink.i3': 'Dish mounting & weatherproofing',
      'services.starlink.i4': 'Router integration (MikroTik / OPNsense)',
      'services.starlink.i5': 'Remote monitoring & management',
      'services.starlink.more': 'Starlink in Crete — learn more →',
      'services.cert.mtcna.title': 'MikroTik Certified Network Associate',
      'services.cert.mtcna.org': 'MikroTik Training Center',
      'services.cert.mtcna.desc': 'Foundational expertise in RouterOS configuration, routing, firewalls, wireless networks, QoS, and tunneling on MikroTik infrastructure.',
      'services.cert.status': 'Certified',
      'services.cert.issued': 'Issued',
      'services.cert.valid': 'Valid for',
      'services.cert.years': '3 years',
      'services.cert.verify': 'Verify certificate',
      'services.cert.degree.status': 'Graduate',
      'services.cert.degree.title': 'Informatics & Telecommunications',
      'services.cert.degree.org': 'University of Thessaly',
      'services.cert.degree.desc': 'University degree covering computer networks, programming, telecommunications, systems, and security — the academic foundation behind the hands-on work.',
      'services.cred.htb.org': 'Active player — Penetration testing labs',
      'services.cred.oss.title': 'Open Source Contributor',
      'services.cred.oss.org': 'Security tools & automation projects',
      'services.cta.title': "Let's work together",
      'services.cta.desc': 'Have a project in mind or need a security assessment? Get in touch to discuss how I can help.',
      'services.cta.btn': 'Get in touch',
      'services.footer.sub': 'Cybersecurity & IT Consulting',

      // Starlink page
      'starlink.title': 'Starlink Installation in Crete',
      'starlink.subtitle': 'Managed Satellite Connectivity',
      'starlink.intro': "Professional Starlink setup across Crete — for homes, villas, farms, and businesses where fixed broadband is slow, unreliable, or simply unavailable. I don't just mount the dish: I integrate it into a proper network with failover, security, and remote monitoring, so you get connectivity you can actually depend on.",
      'starlink.areas': 'Serving Heraklion · Chania · Rethymno · Lasithi · all of Crete',
      'starlink.section.why': 'Why work with me',
      'starlink.why': 'Anyone can point a dish at the sky — the value is in the network behind it. As a MikroTik-certified network engineer (MTCNA) and security professional, I build the connection to stay up when Starlink blips, segment your traffic safely, and fix most issues remotely without a second visit.',
      'starlink.why.i1': 'MTCNA-certified network engineering',
      'starlink.why.i2': 'Multi-WAN failover so you never go dark',
      'starlink.why.i3': 'Secured & monitored, not just plugged in',
      'starlink.why.i4': 'Remote support — most fixes need no site visit',
      'starlink.section.usecases': "Who it's for",
      'starlink.uc.villas.t': 'Villas & Agrotourism',
      'starlink.uc.villas.d': 'Guest-grade Wi-Fi at remote villas and rentals — reliable enough for five-star reviews, with a separate guest network.',
      'starlink.uc.rural.t': 'Rural Homes & Farms',
      'starlink.uc.rural.d': "Real broadband where DSL crawls or doesn't reach — mountain villages, olive groves, off-grid plots.",
      'starlink.uc.work.t': 'Worksites & Remote Offices',
      'starlink.uc.work.d': 'Connectivity from day one on construction sites, temporary offices, and seasonal operations.',
      'starlink.uc.backup.t': 'Business Backup Link',
      'starlink.uc.backup.d': 'Automatic failover to Starlink the moment your primary line drops — no downtime, no lost sales.',
      'starlink.section.process': 'How it works',
      'starlink.step.1.t': 'Site survey',
      'starlink.step.1.d': 'Obstruction check and the best mount position for a clear view of the sky.',
      'starlink.step.2.t': 'Installation',
      'starlink.step.2.d': 'Secure mounting, weatherproofed cabling, and tidy routing indoors.',
      'starlink.step.3.t': 'Network integration',
      'starlink.step.3.d': 'Router setup, failover, VLANs, VPN and Wi-Fi tuned to your space.',
      'starlink.step.4.t': 'Ongoing management',
      'starlink.step.4.d': 'Remote monitoring, updates, and support so it keeps running.',
      'starlink.section.packages': 'Packages',
      'starlink.pkg.note': 'Hardware (Starlink kit) billed separately. Final quote after the site survey.',
      'starlink.pkg.popular': 'Popular',
      'starlink.pkg.install.t': 'Installation',
      'starlink.pkg.install.d': 'One-off professional install, done right.',
      'starlink.pkg.install.f1': 'Site survey & obstruction check',
      'starlink.pkg.install.f2': 'Mounting & weatherproofed cabling',
      'starlink.pkg.install.f3': 'Router setup & Wi-Fi configuration',
      'starlink.pkg.managed.t': 'Install + Managed',
      'starlink.pkg.managed.d': 'Everything in Install, plus we keep it healthy.',
      'starlink.pkg.managed.f1': 'Multi-WAN failover & VLAN segmentation',
      'starlink.pkg.managed.f2': 'Remote monitoring & firmware updates',
      'starlink.pkg.managed.f3': 'Priority remote support',
      'starlink.pkg.business.t': 'Business Failover',
      'starlink.pkg.business.d': 'Starlink as a resilient backup to your main line.',
      'starlink.pkg.business.f1': 'Automatic failover (Starlink + fixed/4G)',
      'starlink.pkg.business.f2': 'Hardened firewall & VPN',
      'starlink.pkg.business.f3': 'SLA-based monitoring & alerting',
      'starlink.section.faq': 'Questions',
      'starlink.faq.q1': 'Do you cover my area?',
      'starlink.faq.a1': 'I serve all of Crete — Heraklion, Chania, Rethymno and Lasithi, including remote and mountain locations. If you can see the sky, Starlink usually works.',
      'starlink.faq.q2': 'How fast and reliable is it?',
      'starlink.faq.a2': "Typically 100–250 Mbps down with low latency. With multi-WAN failover I add a second line so a brief Starlink dropout doesn't take you offline.",
      'starlink.faq.q3': 'Do I need to buy the Starlink kit first?',
      'starlink.faq.a3': 'You can buy it yourself, or I can advise on the right kit (Standard, Mini, or High Performance) for your site before you order.',
      'starlink.faq.q4': 'Can you integrate it with my existing network?',
      'starlink.faq.a4': "Yes — that's the core of what I do. MikroTik, OPNsense or pfSense, VLANs, VPN, guest networks and failover are all standard.",
      'starlink.cta.title': 'Request a free site survey',
      'starlink.cta.desc': "Tell me your location and what you need the connection for. I'll assess feasibility and send a tailored quote.",
      'starlink.form.name': 'Name',
      'starlink.form.email': 'Email',
      'starlink.form.location': 'Location (area / village)',
      'starlink.form.message': 'What do you need the connection for?',
      'starlink.form.submit': 'Request site survey',
      'starlink.form.or': 'or reach me directly',
      'starlink.form.sending': 'Sending…',
      'starlink.form.success': "Got it ✓ — I'll reply to your email within 24 hours.",
      'starlink.form.error': 'Something went wrong — please email me directly.',
      'starlink.footer.sub': 'Starlink Installation & Managed Connectivity · Crete',
      'starlink.deepdive': 'Technical deep-dive: how I build Starlink multi-WAN failover on MikroTik →',

      // Projects page
      'projects.title': 'Projects',
      'projects.subtitle': 'Open Source Tools',
      'projects.intro': 'A selection of cybersecurity and automation tools I have built and open-sourced. Most are written in Python, Bash, or C.',
      'projects.section.featured': 'Featured projects',
      'projects.section.all': 'All projects',
      'projects.featured.badge': 'Featured',
      'projects.loading': 'Loading from GitHub…',
      'projects.empty': 'No public repositories found.',
      'projects.noDesc': 'No description',

      // Blog page
      'blog.title': 'Blog',
      'blog.subtitle': 'Research & Writeups',
      'blog.filter.all': 'All',
      'blog.empty': 'No posts yet.',
      'blog.emptyCat': 'No posts in this category.',
      'blog.post': 'post',
      'blog.posts': 'posts',
      'blog.in': 'in',
      'blog.read': 'read',
      'blog.search': 'Search posts…',

      // 404
      '404.message': "The page you're looking for doesn't exist or has been moved.",
      '404.back': 'Back to home',
    },
    el: {
      // Nav
      'nav.services': 'Υπηρεσίες',
      'nav.projects': 'Έργα',
      'nav.blog': 'Ιστολόγιο',
      'nav.toggleMenu': 'Άνοιγμα μενού',
      'nav.toggleTheme': 'Αλλαγή θέματος',
      'nav.toggleLang': 'Αλλαγή γλώσσας',
      'nav.main': 'Κύρια πλοήγηση',

      // Index
      'index.section.connect': 'Σύνδεση',

      // Services page
      'services.title': 'Υπηρεσίες',
      'services.subtitle': 'Συμβουλευτική Κυβερνοασφάλειας & IT',
      'services.intro': 'Συνεργάζομαι με επιχειρήσεις και ιδιώτες για τον εντοπισμό αδυναμιών ασφαλείας, την θωράκιση υποδομών και την κατασκευή αξιόπιστων συστημάτων. Με έδρα την Κρήτη, διαθέσιμος εξ αποστάσεως παγκοσμίως.',
      'services.section.offer': 'Τι προσφέρω',
      'services.section.certs': 'Πιστοποιήσεις',
      'services.section.credentials': 'Διαπιστεύσεις',
      'services.pentest.title': 'Δοκιμές Διείσδυσης',
      'services.pentest.desc': 'Προσομοιωμένες επιθέσεις σε εφαρμογές web, δίκτυα και υποδομές για τον εντοπισμό ευπαθειών πριν τις βρουν πραγματικοί επιτιθέμενοι.',
      'services.pentest.i1': 'Έλεγχος εφαρμογών web',
      'services.pentest.i2': 'Pentest δικτύου',
      'services.pentest.i3': 'Ασφάλεια API',
      'services.pentest.i4': 'Ασύρματες δοκιμές',
      'services.pentest.i5': 'Κοινωνική μηχανική',
      'services.audit.title': 'Έλεγχοι Ασφαλείας',
      'services.audit.desc': 'Πλήρης έλεγχος της στάσης ασφαλείας, των ρυθμίσεων, των πολιτικών και του κώδικα για τον εντοπισμό κινδύνων και κενών συμμόρφωσης.',
      'services.audit.i1': 'Έλεγχος ρυθμίσεων',
      'services.audit.i2': 'Έλεγχος κώδικα',
      'services.audit.i3': 'Ασφάλεια cloud',
      'services.audit.i4': 'Έλεγχοι συμμόρφωσης',
      'services.audit.i5': 'Εκτίμηση κινδύνου',
      'services.it.title': 'Υποδομές IT & Αυτοματισμός',
      'services.it.desc': 'Σχεδιασμός και υλοποίηση συστημάτων backup, παρακολούθησης, pipelines ανάπτυξης και προσαρμοσμένων εργαλείων αυτοματισμού.',
      'services.it.i1': 'Backup & disaster recovery',
      'services.it.i2': 'Θωράκιση servers',
      'services.it.i3': 'CI/CD pipelines',
      'services.it.i4': 'Παρακολούθηση & ειδοποιήσεις',
      'services.it.i5': 'Προσαρμοσμένα εργαλεία',
      'services.consulting.title': 'Συμβουλευτική IT',
      'services.consulting.desc': 'Τεχνική καθοδήγηση σε αποφάσεις αρχιτεκτονικής, επιλογή τεχνολογίας, σχεδιασμό δικτύου και στρατηγική ασφάλειας για τον οργανισμό σας.',
      'services.consulting.i1': 'Επισκόπηση αρχιτεκτονικής',
      'services.consulting.i2': 'Σχεδιασμός δικτύου',
      'services.consulting.i3': 'Επιλογή τεχνολογίας',
      'services.consulting.i4': 'Στρατηγική ασφάλειας',
      'services.consulting.i5': 'Σχέδιο απόκρισης σε περιστατικά',
      'services.starlink.title': 'Εγκατάσταση Starlink & Διαχείριση Σύνδεσης',
      'services.starlink.badge': 'Πιο ζητούμενο',
      'services.starlink.desc': 'Αξιόπιστο ίντερνετ εκεί που δεν φτάνει η σταθερή γραμμή — αγροτικές τοποθεσίες, βίλες, εργοτάξια και επιχειρήσεις που χρειάζονται εφεδρική σύνδεση. Αναλαμβάνω την πλήρη εγκατάσταση και την ενσωμάτωση με MikroTik multi-WAN failover, VLANs, VPN και monitoring, ώστε η σύνδεση να μένει σταθερή και ασφαλής — από την αυτοψία έως τη συνεχή απομακρυσμένη διαχείριση.',
      'services.starlink.i1': 'Multi-WAN failover (Starlink + 4G/DSL)',
      'services.starlink.i2': 'Αυτοψία χώρου & έλεγχος εμποδίων',
      'services.starlink.i3': 'Τοποθέτηση & στεγανοποίηση κεραίας',
      'services.starlink.i4': 'Ενσωμάτωση router (MikroTik / OPNsense)',
      'services.starlink.i5': 'Απομακρυσμένη παρακολούθηση & διαχείριση',
      'services.starlink.more': 'Starlink στην Κρήτη — δες αναλυτικά →',
      'services.cert.mtcna.title': 'MikroTik Certified Network Associate',
      'services.cert.mtcna.org': 'MikroTik Training Center',
      'services.cert.mtcna.desc': 'Θεμελιώδης εμπειρία σε ρυθμίσεις RouterOS, δρομολόγηση, firewalls, ασύρματα δίκτυα, QoS και tunneling σε υποδομές MikroTik.',
      'services.cert.status': 'Πιστοποιημένος',
      'services.cert.issued': 'Εκδόθηκε',
      'services.cert.valid': 'Ισχύει για',
      'services.cert.years': '3 χρόνια',
      'services.cert.verify': 'Επαλήθευση πιστοποιητικού',
      'services.cert.degree.status': 'Απόφοιτος',
      'services.cert.degree.title': 'Πληροφορική & Τηλεπικοινωνίες',
      'services.cert.degree.org': 'Πανεπιστήμιο Θεσσαλίας',
      'services.cert.degree.desc': 'Πανεπιστημιακό πτυχίο με αντικείμενο δίκτυα υπολογιστών, προγραμματισμό, τηλεπικοινωνίες, συστήματα και ασφάλεια — το ακαδημαϊκό υπόβαθρο πίσω από την πρακτική δουλειά.',
      'services.cred.htb.org': 'Ενεργός παίκτης — Εργαστήρια pentesting',
      'services.cred.oss.title': 'Συνεισφέρων Open Source',
      'services.cred.oss.org': 'Εργαλεία ασφαλείας & έργα αυτοματισμού',
      'services.cta.title': 'Ας συνεργαστούμε',
      'services.cta.desc': 'Έχετε ένα έργο στο μυαλό ή χρειάζεστε αξιολόγηση ασφαλείας; Επικοινωνήστε για να συζητήσουμε πώς μπορώ να βοηθήσω.',
      'services.cta.btn': 'Επικοινωνία',
      'services.footer.sub': 'Συμβουλευτική Κυβερνοασφάλειας & IT',

      // Starlink page
      'starlink.title': 'Εγκατάσταση Starlink στην Κρήτη',
      'starlink.subtitle': 'Διαχειριζόμενη Δορυφορική Σύνδεση',
      'starlink.intro': 'Επαγγελματική εγκατάσταση Starlink σε όλη την Κρήτη — για σπίτια, βίλες, αγροκτήματα και επιχειρήσεις όπου το σταθερό ίντερνετ είναι αργό, αναξιόπιστο ή απλώς δεν υπάρχει. Δεν τοποθετώ απλώς την κεραία: την ενσωματώνω σε ένα σωστό δίκτυο με failover, ασφάλεια και απομακρυσμένη παρακολούθηση, ώστε να έχετε σύνδεση που πραγματικά εμπιστεύεστε.',
      'starlink.areas': 'Εξυπηρετώ Ηράκλειο · Χανιά · Ρέθυμνο · Λασίθι · όλη την Κρήτη',
      'starlink.section.why': 'Γιατί εμένα',
      'starlink.why': 'Ο καθένας μπορεί να στρέψει μια κεραία στον ουρανό — η αξία είναι στο δίκτυο από πίσω. Ως πιστοποιημένος μηχανικός δικτύων MikroTik (MTCNA) και επαγγελματίας ασφάλειας, στήνω τη σύνδεση να μένει σταθερή όταν το Starlink «κολλήσει», διαχωρίζω με ασφάλεια την κίνηση και λύνω τα περισσότερα θέματα απομακρυσμένα χωρίς δεύτερη επίσκεψη.',
      'starlink.why.i1': 'Μηχανική δικτύων με πιστοποίηση MTCNA',
      'starlink.why.i2': 'Multi-WAN failover για να μη μένετε ποτέ εκτός',
      'starlink.why.i3': 'Ασφαλισμένο & παρακολουθούμενο, όχι απλώς στο ρεύμα',
      'starlink.why.i4': 'Απομακρυσμένη υποστήριξη — οι πιο πολλές λύσεις χωρίς επίσκεψη',
      'starlink.section.usecases': 'Σε ποιους απευθύνεται',
      'starlink.uc.villas.t': 'Βίλες & Αγροτουρισμός',
      'starlink.uc.villas.d': 'Wi-Fi επιπέδου φιλοξενίας σε απομακρυσμένες βίλες και καταλύματα — αρκετά αξιόπιστο για πεντάστερες κριτικές, με ξεχωριστό δίκτυο επισκεπτών.',
      'starlink.uc.rural.t': 'Αγροτικά Σπίτια & Κτήματα',
      'starlink.uc.rural.d': 'Πραγματικό broadband εκεί που το DSL σέρνεται ή δεν φτάνει — ορεινά χωριά, ελαιώνες, εκτός δικτύου αγροτεμάχια.',
      'starlink.uc.work.t': 'Εργοτάξια & Απομακρυσμένα Γραφεία',
      'starlink.uc.work.d': 'Σύνδεση από την πρώτη μέρα σε εργοτάξια, προσωρινά γραφεία και εποχικές δραστηριότητες.',
      'starlink.uc.backup.t': 'Εφεδρική Γραμμή Επιχείρησης',
      'starlink.uc.backup.d': 'Αυτόματο failover στο Starlink μόλις πέσει η κύρια γραμμή — χωρίς διακοπές, χωρίς χαμένες πωλήσεις.',
      'starlink.section.process': 'Πώς γίνεται',
      'starlink.step.1.t': 'Αυτοψία χώρου',
      'starlink.step.1.d': 'Έλεγχος εμποδίων και η καλύτερη θέση στήριξης για καθαρή θέα στον ουρανό.',
      'starlink.step.2.t': 'Εγκατάσταση',
      'starlink.step.2.d': 'Σταθερή στήριξη, στεγανοποιημένη καλωδίωση και καθαρή όδευση στο εσωτερικό.',
      'starlink.step.3.t': 'Ενσωμάτωση δικτύου',
      'starlink.step.3.d': 'Ρύθμιση router, failover, VLANs, VPN και Wi-Fi προσαρμοσμένα στον χώρο σας.',
      'starlink.step.4.t': 'Συνεχής διαχείριση',
      'starlink.step.4.d': 'Απομακρυσμένη παρακολούθηση, ενημερώσεις και υποστήριξη για να δουλεύει αδιάλειπτα.',
      'starlink.section.packages': 'Πακέτα',
      'starlink.pkg.note': 'Ο εξοπλισμός (kit Starlink) χρεώνεται ξεχωριστά. Τελική προσφορά μετά την αυτοψία.',
      'starlink.pkg.popular': 'Δημοφιλές',
      'starlink.pkg.install.t': 'Εγκατάσταση',
      'starlink.pkg.install.d': 'Εφάπαξ επαγγελματική εγκατάσταση, σωστά.',
      'starlink.pkg.install.f1': 'Αυτοψία χώρου & έλεγχος εμποδίων',
      'starlink.pkg.install.f2': 'Στήριξη & στεγανοποιημένη καλωδίωση',
      'starlink.pkg.install.f3': 'Ρύθμιση router & διαμόρφωση Wi-Fi',
      'starlink.pkg.managed.t': 'Εγκατάσταση + Διαχείριση',
      'starlink.pkg.managed.d': 'Ό,τι περιλαμβάνει η Εγκατάσταση, και το κρατάμε υγιές.',
      'starlink.pkg.managed.f1': 'Multi-WAN failover & διαχωρισμός VLAN',
      'starlink.pkg.managed.f2': 'Απομακρυσμένη παρακολούθηση & ενημερώσεις firmware',
      'starlink.pkg.managed.f3': 'Υποστήριξη με προτεραιότητα',
      'starlink.pkg.business.t': 'Εφεδρεία Επιχείρησης',
      'starlink.pkg.business.d': 'Το Starlink ως ανθεκτική εφεδρεία στην κύρια γραμμή σας.',
      'starlink.pkg.business.f1': 'Αυτόματο failover (Starlink + σταθερή/4G)',
      'starlink.pkg.business.f2': 'Θωρακισμένο firewall & VPN',
      'starlink.pkg.business.f3': 'Παρακολούθηση & ειδοποιήσεις βάσει SLA',
      'starlink.section.faq': 'Ερωτήσεις',
      'starlink.faq.q1': 'Καλύπτετε την περιοχή μου;',
      'starlink.faq.a1': 'Εξυπηρετώ όλη την Κρήτη — Ηράκλειο, Χανιά, Ρέθυμνο και Λασίθι, μαζί με απομακρυσμένες και ορεινές τοποθεσίες. Αν βλέπετε τον ουρανό, το Starlink συνήθως δουλεύει.',
      'starlink.faq.q2': 'Πόσο γρήγορο και αξιόπιστο είναι;',
      'starlink.faq.a2': 'Τυπικά 100–250 Mbps download με χαμηλό latency. Με multi-WAN failover προσθέτω δεύτερη γραμμή ώστε μια σύντομη διακοπή του Starlink να μη σας αφήνει εκτός.',
      'starlink.faq.q3': 'Πρέπει να αγοράσω πρώτα το kit Starlink;',
      'starlink.faq.a3': 'Μπορείτε να το αγοράσετε μόνοι σας, ή σας συμβουλεύω για το σωστό kit (Standard, Mini ή High Performance) για τον χώρο σας πριν παραγγείλετε.',
      'starlink.faq.q4': 'Μπορείτε να το ενσωματώσετε στο υπάρχον δίκτυό μου;',
      'starlink.faq.a4': 'Ναι — αυτό είναι το κύριο αντικείμενό μου. MikroTik, OPNsense ή pfSense, VLANs, VPN, δίκτυα επισκεπτών και failover είναι όλα στάνταρ.',
      'starlink.cta.title': 'Ζητήστε δωρεάν αυτοψία',
      'starlink.cta.desc': 'Πείτε μου την τοποθεσία σας και για τι χρειάζεστε τη σύνδεση. Θα αξιολογήσω τη δυνατότητα και θα στείλω εξατομικευμένη προσφορά.',
      'starlink.form.name': 'Όνομα',
      'starlink.form.email': 'Email',
      'starlink.form.location': 'Τοποθεσία (περιοχή / χωριό)',
      'starlink.form.message': 'Για τι χρειάζεσαι τη σύνδεση;',
      'starlink.form.submit': 'Ζήτησε αυτοψία',
      'starlink.form.or': 'ή επικοινώνησε απευθείας',
      'starlink.form.sending': 'Αποστολή…',
      'starlink.form.success': 'Έλαβα το αίτημά σου ✓ — θα απαντήσω εντός 24 ωρών στο email σου.',
      'starlink.form.error': 'Κάτι πήγε στραβά — στείλε μου email απευθείας.',
      'starlink.footer.sub': 'Εγκατάσταση Starlink & Διαχείριση Σύνδεσης · Κρήτη',
      'starlink.deepdive': 'Τεχνική ανάλυση: πώς στήνω το multi-WAN failover του Starlink σε MikroTik →',

      // Projects page
      'projects.title': 'Έργα',
      'projects.subtitle': 'Εργαλεία Ανοιχτού Κώδικα',
      'projects.intro': 'Μια επιλογή εργαλείων κυβερνοασφάλειας και αυτοματισμού που έχω κατασκευάσει και δημοσιεύσει με ανοιχτό κώδικα. Τα περισσότερα είναι γραμμένα σε Python, Bash ή C.',
      'projects.section.featured': 'Προτεινόμενα έργα',
      'projects.section.all': 'Όλα τα έργα',
      'projects.featured.badge': 'Προτεινόμενο',
      'projects.loading': 'Φόρτωση από το GitHub…',
      'projects.empty': 'Δεν βρέθηκαν δημόσια αποθετήρια.',
      'projects.noDesc': 'Χωρίς περιγραφή',

      // Blog page
      'blog.title': 'Ιστολόγιο',
      'blog.subtitle': 'Έρευνα & Writeups',
      'blog.filter.all': 'Όλα',
      'blog.empty': 'Δεν υπάρχουν αναρτήσεις ακόμα.',
      'blog.emptyCat': 'Δεν υπάρχουν αναρτήσεις σε αυτή την κατηγορία.',
      'blog.post': 'ανάρτηση',
      'blog.posts': 'αναρτήσεις',
      'blog.in': 'στο',
      'blog.read': 'ανάγνωση',
      'blog.search': 'Αναζήτηση…',

      // 404
      '404.message': 'Η σελίδα που ψάχνετε δεν υπάρχει ή έχει μετακινηθεί.',
      '404.back': 'Πίσω στην αρχή',
    },
  };

  // Greek-speaking regions used for IP-based language defaulting.
  const GREEK_REGIONS = ['GR', 'CY'];
  function geoLang(cc) {
    return GREEK_REGIONS.includes(String(cc).toUpperCase()) ? 'el' : 'en';
  }

  function detectLang() {
    const param = new URLSearchParams(location.search).get('lang');
    if (param && SUPPORTED.includes(param)) return param;   // ?lang= (shared / hreflang links)
    const saved = localStorage.getItem('noctis_lang');
    if (saved && SUPPORTED.includes(saved)) return saved;   // explicit choice wins
    const geo = localStorage.getItem('noctis_geo');
    if (geo) return geoLang(geo);                            // cached region from a past visit
    const nav = (navigator.language || navigator.userLanguage || 'en').toLowerCase().split('-')[0];
    return SUPPORTED.includes(nav) ? nav : 'en';            // first-paint fallback: browser language
  }

  let currentLang = detectLang();

  function t(key) {
    return (TRANSLATIONS[currentLang] && TRANSLATIONS[currentLang][key]) || TRANSLATIONS.en[key] || key;
  }

  function applyTranslations(root) {
    root = root || document;
    root.querySelectorAll('[data-i18n]').forEach(el => {
      el.textContent = t(el.getAttribute('data-i18n'));
    });
    root.querySelectorAll('*').forEach(el => {
      for (const attr of el.attributes) {
        if (attr.name.startsWith('data-i18n-attr-')) {
          const target = attr.name.slice('data-i18n-attr-'.length);
          el.setAttribute(target, t(attr.value));
        }
      }
    });
    document.documentElement.setAttribute('lang', currentLang);
  }

  function setLang(lang) {
    if (!SUPPORTED.includes(lang)) return;
    currentLang = lang;
    localStorage.setItem('noctis_lang', lang);
    applyTranslations();
    document.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
  }

  function toggleLang() {
    setLang(currentLang === 'en' ? 'el' : 'en');
  }

  // Apply a language WITHOUT recording it as a manual choice (used by geo detection).
  function applyAutoLang(lang) {
    if (!SUPPORTED.includes(lang) || lang === currentLang) return;
    currentLang = lang;
    applyTranslations();
    document.dispatchEvent(new CustomEvent('langchange', { detail: { lang, auto: true } }));
  }

  // Region-based default: visitors whose IP resolves to a Greek-speaking country
  // default to Greek. Runs at most once per visitor (result cached in localStorage),
  // never overrides an explicit manual choice, and fails silently if the lookup is blocked.
  function geoDetect() {
    if (localStorage.getItem('noctis_lang')) return;   // manual choice already made
    if (localStorage.getItem('noctis_geo')) return;     // region already resolved before
    fetch('https://get.geojs.io/v1/ip/country.json', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!d || !d.country) return;
        localStorage.setItem('noctis_geo', String(d.country).toUpperCase());
        if (!localStorage.getItem('noctis_lang')) applyAutoLang(geoLang(d.country));
      })
      .catch(() => {});
  }

  window.NoctisI18n = { t, setLang, toggleLang, applyTranslations, getLang: () => currentLang, supported: SUPPORTED };

  function init() { applyTranslations(); geoDetect(); }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
