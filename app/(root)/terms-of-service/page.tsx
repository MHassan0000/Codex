import Link from "next/link";

const TermsOfService = () => {
    return (
        <section className="w-full">
            <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-10 py-16 sm:py-24">
                {/* Header */}
                <div className="mb-12">
                    <Link
                        href="/"
                        className="text-xs uppercase tracking-[2px] text-white/30 hover:text-orange-accent transition-colors duration-300"
                    >
                        ← Back to Home
                    </Link>
                    <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mt-6">
                        Terms of Service
                    </h1>
                    <p className="text-sm text-white/30 mt-2">
                        Last updated: February 23, 2026
                    </p>
                </div>

                {/* Content */}
                <div className="space-y-10">
                    <div>
                        <h2 className="text-lg font-semibold text-white/90 mb-3">
                            1. Acceptance of Terms
                        </h2>
                        <p className="text-sm text-white/45 leading-relaxed">
                            By creating an account and using Codex, you agree to
                            be bound by these Terms of Service. If you do not
                            agree with any part of these terms, you should not
                            use the platform. These terms apply to all users of
                            the service, including borrowers and administrators.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold text-white/90 mb-3">
                            2. Account Registration
                        </h2>
                        <p className="text-sm text-white/45 leading-relaxed">
                            To use Codex, you must register with a valid
                            university email address and provide accurate
                            personal information, including your university ID
                            and a photo of your university card. Your account is
                            subject to approval by library administrators. You
                            are responsible for maintaining the confidentiality
                            of your login credentials and for all activity that
                            occurs under your account.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold text-white/90 mb-3">
                            3. Borrowing Rules
                        </h2>
                        <p className="text-sm text-white/45 leading-relaxed mb-3">
                            When borrowing books through Codex, you agree to the
                            following:
                        </p>
                        <ul className="space-y-2 text-sm text-white/45 leading-relaxed ml-4">
                            <li className="relative pl-4 before:content-[''] before:absolute before:left-0 before:top-2.25 before:w-1.5 before:h-1.5 before:rounded-full before:bg-orange-accent/40">
                                Return all borrowed books by the specified due
                                date
                            </li>
                            <li className="relative pl-4 before:content-[''] before:absolute before:left-0 before:top-2.25 before:w-1.5 before:h-1.5 before:rounded-full before:bg-orange-accent/40">
                                Handle borrowed materials with care and return
                                them in the same condition
                            </li>
                            <li className="relative pl-4 before:content-[''] before:absolute before:left-0 before:top-2.25 before:w-1.5 before:h-1.5 before:rounded-full before:bg-orange-accent/40">
                                Not transfer borrowed books to other individuals
                            </li>
                            <li className="relative pl-4 before:content-[''] before:absolute before:left-0 before:top-2.25 before:w-1.5 before:h-1.5 before:rounded-full before:bg-orange-accent/40">
                                Report any damage or loss to the library
                                administration promptly
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold text-white/90 mb-3">
                            4. Account Status
                        </h2>
                        <p className="text-sm text-white/45 leading-relaxed">
                            Library administrators reserve the right to approve,
                            suspend, or reject user accounts at their
                            discretion. Accounts may be suspended for overdue
                            books, misuse of the platform, or violation of these
                            terms. Users with pending account status will not be
                            able to borrow books until their account has been
                            approved.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold text-white/90 mb-3">
                            5. Acceptable Use
                        </h2>
                        <p className="text-sm text-white/45 leading-relaxed mb-3">
                            You agree not to:
                        </p>
                        <ul className="space-y-2 text-sm text-white/45 leading-relaxed ml-4">
                            <li className="relative pl-4 before:content-[''] before:absolute before:left-0 before:top-2.25 before:w-1.5 before:h-1.5 before:rounded-full before:bg-orange-accent/40">
                                Use the platform for any unlawful purpose or in
                                violation of university policies
                            </li>
                            <li className="relative pl-4 before:content-[''] before:absolute before:left-0 before:top-2.25 before:w-1.5 before:h-1.5 before:rounded-full before:bg-orange-accent/40">
                                Attempt to gain unauthorized access to other
                                accounts or administrative functions
                            </li>
                            <li className="relative pl-4 before:content-[''] before:absolute before:left-0 before:top-2.25 before:w-1.5 before:h-1.5 before:rounded-full before:bg-orange-accent/40">
                                Submit false or misleading information during
                                registration
                            </li>
                            <li className="relative pl-4 before:content-[''] before:absolute before:left-0 before:top-2.25 before:w-1.5 before:h-1.5 before:rounded-full before:bg-orange-accent/40">
                                Interfere with or disrupt the platform&apos;s
                                functionality
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold text-white/90 mb-3">
                            6. Intellectual Property
                        </h2>
                        <p className="text-sm text-white/45 leading-relaxed">
                            All content on Codex, including book descriptions,
                            cover images, and platform design, is protected by
                            intellectual property rights. The books available
                            through the library remain the property of the
                            institution. Users may not reproduce, distribute, or
                            create derivative works from any content on the
                            platform without prior written permission.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold text-white/90 mb-3">
                            7. Limitation of Liability
                        </h2>
                        <p className="text-sm text-white/45 leading-relaxed">
                            Codex is provided on an &ldquo;as is&rdquo; basis.
                            We make no warranties regarding the availability,
                            accuracy, or reliability of the platform. The
                            library and its administrators shall not be liable
                            for any indirect, incidental, or consequential
                            damages arising from your use of the service.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold text-white/90 mb-3">
                            8. Termination
                        </h2>
                        <p className="text-sm text-white/45 leading-relaxed">
                            We reserve the right to terminate or suspend your
                            account at any time if you violate these Terms of
                            Service. Upon termination, all outstanding borrowed
                            books must be returned immediately. You may also
                            request to close your account at any time by
                            contacting the library administration.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold text-white/90 mb-3">
                            9. Changes to Terms
                        </h2>
                        <p className="text-sm text-white/45 leading-relaxed">
                            We may revise these Terms of Service at any time.
                            Changes will be posted on this page with an updated
                            revision date. Your continued use of Codex after any
                            modifications constitutes acceptance of the updated
                            terms.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold text-white/90 mb-3">
                            10. Contact
                        </h2>
                        <p className="text-sm text-white/45 leading-relaxed">
                            For questions or concerns about these Terms of
                            Service, please reach out to the library
                            administration through your university&apos;s
                            official communication channels.
                        </p>
                    </div>
                </div>

                {/* Bottom divider */}
                <div className="mt-16 pt-8 border-t border-white/6">
                    <p className="text-xs text-white/20">
                        &copy; {new Date().getFullYear()} Codex. All rights
                        reserved.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default TermsOfService;
