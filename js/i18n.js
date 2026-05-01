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
      'services.cert.mtcna.title': 'MikroTik Certified Network Associate',
      'services.cert.mtcna.org': 'MikroTik Training Center',
      'services.cert.mtcna.desc': 'Foundational expertise in RouterOS configuration, routing, firewalls, wireless networks, QoS, and tunneling on MikroTik infrastructure.',
      'services.cert.status': 'Certified',
      'services.cert.issued': 'Issued',
      'services.cert.valid': 'Valid for',
      'services.cert.years': '3 years',
      'services.cert.verify': 'Verify certificate',
      'services.cred.htb.org': 'Active player — Penetration testing labs',
      'services.cred.oss.title': 'Open Source Contributor',
      'services.cred.oss.org': 'Security tools & automation projects',
      'services.cta.title': "Let's work together",
      'services.cta.desc': 'Have a project in mind or need a security assessment? Get in touch to discuss how I can help.',
      'services.cta.btn': 'Get in touch',
      'services.footer.sub': 'Cybersecurity & IT Consulting',

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
      'services.cert.mtcna.title': 'MikroTik Certified Network Associate',
      'services.cert.mtcna.org': 'MikroTik Training Center',
      'services.cert.mtcna.desc': 'Θεμελιώδης εμπειρία σε ρυθμίσεις RouterOS, δρομολόγηση, firewalls, ασύρματα δίκτυα, QoS και tunneling σε υποδομές MikroTik.',
      'services.cert.status': 'Πιστοποιημένος',
      'services.cert.issued': 'Εκδόθηκε',
      'services.cert.valid': 'Ισχύει για',
      'services.cert.years': '3 χρόνια',
      'services.cert.verify': 'Επαλήθευση πιστοποιητικού',
      'services.cred.htb.org': 'Ενεργός παίκτης — Εργαστήρια pentesting',
      'services.cred.oss.title': 'Συνεισφέρων Open Source',
      'services.cred.oss.org': 'Εργαλεία ασφαλείας & έργα αυτοματισμού',
      'services.cta.title': 'Ας συνεργαστούμε',
      'services.cta.desc': 'Έχετε ένα έργο στο μυαλό ή χρειάζεστε αξιολόγηση ασφαλείας; Επικοινωνήστε για να συζητήσουμε πώς μπορώ να βοηθήσω.',
      'services.cta.btn': 'Επικοινωνία',
      'services.footer.sub': 'Συμβουλευτική Κυβερνοασφάλειας & IT',

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

  function detectLang() {
    const saved = localStorage.getItem('noctis_lang');
    if (saved && SUPPORTED.includes(saved)) return saved;
    const nav = (navigator.language || navigator.userLanguage || 'en').toLowerCase().split('-')[0];
    return SUPPORTED.includes(nav) ? nav : 'en';
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

  window.NoctisI18n = { t, setLang, toggleLang, applyTranslations, getLang: () => currentLang, supported: SUPPORTED };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => applyTranslations());
  } else {
    applyTranslations();
  }
})();
