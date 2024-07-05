---
title: 'IBLE: A simple label generation, verification, and analysis tool for videos'
tags:
  - labeling
  - machine learning
  - NodeJS
  - self-hosted
  - video
authors:
  - name: Jeff Hykin
    affiliation: 1
affiliations:
 - name: Texas A&M University, United States
   index: 1
date: 6 June 2024
bibliography: paper.bib

---

# Context Summary

Many experiments involve videos of human participants. This is often done to monitor task completion, check emotional response, or even track the lack of a reaction. In some fields, such as medicine and disaster response, it can be incredibly important to validate the accuracy of labels. Despite the importance, labeling videos is often time-consuming, error-prone, and unstandardized. Many commerial tools are unavailble for research work due to the confidentiality. Open source tools that are designed for the task are not oriented either towards beginners or towards fields beyond machine learning. Small aspects of data labelling, such as differences in capitalization of label names, can cause major downstream issues in analysis and validation. In the fields of psychology, biomedical, and human robotic interaction, it is still common to manually type video timestamps as a means of labeling videos. 

<!-- 1 -->
<!-- Qualitative analysis of data is relevant for a variety of domains including empirical research
studies and social sciences. While performing qualitative analysis of large textual data sets such
as data from interviews, surveys, mailing lists, and code repositories, condensing pieces of data
into a set of terms or keywords simplifies analysis, and helps in obtaining useful insight. This
condensation of data can be achieved by associating keywords, a.k.a. labels, with text fragments,
a.k.a artifacts. It is essential during this type of research to achieve greater accuracy, facilitate
collaboration, build consensus, and limit bias. LaMa, short for Labelling Machine, is an open-
source web application developed for aiding in thematic analysis of qualitative data. The source
code and the documentation of the tool are available at https://github.com/muctadir/lama.
In addition to being open-source, LaMa facilitates thematic analysis through features such as
artifact based collaborative labelling, consensus building through conflict resolution techniques,
grouping of labels into themes, and private installation with complete control over research
data. With the help of this tool and flow it enforces, thematic analysis becomes less time
consuming and more structured. -->

<!-- 2 -->
<!-- The forces on stars, galaxies, and dark matter under external gravitational
fields lead to the dynamical evolution of structures in the universe. The orbits
of these bodies are therefore key to understanding the formation, history, and
future state of galaxies. The field of "galactic dynamics," which aims to model
the gravitating components of galaxies to study their structure and evolution,
is now well-established, commonly taught, and frequently used in astronomy.
Aside from toy problems and demonstrations, the majority of problems require
efficient numerical tools, many of which require the same base code (e.g., for
performing numerical orbit integration). --> 

# Statement of need

There are many cases where users of all skill levels need to efficiently label confidential videos, in a way that can be validated by researchers that do not have programming backgrounds. To achieve this, we believe there are both minimal criteria that must be met, as well as higher performance across key aspects of a tool.

Criteria:
- Maintained Privacy and Ownership of Data
- Secure and Auditable
- Capable of Arbitrary Verification Quality (the researcher can use the tool to acheive high, low, etc verification quality)
- Accesible

Aspects in need of improvement:
- User Friction
- Labeling Throughput
- Ease of Collaboration
- Standardization across multiple diciplines
- Extensibility
- Reliability

We translate these high to more concrete requirements:
- Open Source: To mainin privacy and ownership, be accessible, auditable, and improve extensibility we believe the tool must be open source. This means a license such as MIT, Apache, or GPL, with the code available on GitHub, GitLab, SourceForge, or similar platforms.
- Cross Platform: Our definition of accessible means the tool must support the three largest platforms: Windows, Mac, and Linux.
- Web Interface: For both collaboration and accessiblity, we believe its important that multiple users be able to label videos even if the videos are not stored on their personal machines.
- Single Standardized CSV Data Format: In order to be accessible to those without programming backgrounds, we believe having a primary format of CSV is required. To avoid detracting from extensibility, collaboration, and standardization, the format must be cabable of having additional fields, be the same format for both uploads and downloads, and differentiate between data types such as strings, numbers, and dates.
- Speed of use: To reduce the user friction, we set the goal of a new user's being capable of installation, video loading, and a first label to a video in under 15 minutes.
- Data Transference: For the goal of collaboration, we beleive it should always be possible to download the all of the data from the tool, and upload it to another user's instance without any loss of fidelity.
- Verification Structure: 
- Throughput:



<!-- For users of all skill levels to efficiently label confidential videos, in a way that can be validated by non-developers, we believe we need higher performance across the following criteria:

We interpret these high level goals as a need for the following features:
1. Lack of friction: This means minimizing the barrier to entry in terms of technial skill, avoiding time consuming processes such as uploading hundreds of hours of video, having a focused UI for new users, as well as an abunance of shortcuts for expert users to reduce duration of labeling.

In order for experienced and inexperienced users to quickly generate labels for connfidental videos in a way that can be validated and processed by reseachers of various fields, we believe we need to meet the follow criteria:
- Public Ownership: This includes both being able to run the code locally, also k known as self-histed code being able to validate that the source code does what it is claiming to do, but also includes that the tool be financially accessible to the reseach community.
- 

IBLE ("ible" as in "reproducible") is a tool allowing beginners and experts to label moments in videos quickly

graphical interface designed with minimal barrier to entry to video labeling, verification, and analysis. In order to achieve this, we believe the following features are necessary:
- Functions with both private and public videos
    - Free
    - Open source
    - Offline
- Easy to verify
    - Confidence value
    - Author email
    - Standardized format
- Collaborative
    - Importing and exporting uses a standard human-readable format
    - Mergeable data structures (id values, timestamps, etc.)
- Time spent and cognitive load minimized for both novice and expert users
    - Local videos
    - No downloading of youtube videos
    - Importing and exporting uses a standard human-readable format
    - Renders videos of common formats (ex .avi, .mp4, .mov)
    - Video demonstrations of common tasks
    - The ability to jump to the next unverified label within a video
    - The ability to upload bulk labels (from another person or machine)
    - All actions capable through either mouse (accessible to novice) or keyboard (for optimal labeling speed)
    - Minimal opportunity for errors:
        - such as duplicate labels, misspellings, and accidential actions -->

In order to facilitate verification and standaization, ILVL uses the same .yaml format for importing and exporting data, along with an interactive GUI interface. It is designed for both private and public videos. There is a single .json format for uploading and downloading video labels, and a highly interactive web interface to demonstrate the format to researchers who may be less familiar with coding.
<!-- 1 -->
<!-- Analyzing qualitative data has been proven to be labor intensive and time consuming task
(Pope et al., 2000) due to its nature. Thematic analysis (Kiger & Varpio, 2020) is a powerful
yet flexible method for performing such analysis. Analyzing textual data through this method
allows a researcher to understand experiences and thoughts, as well as emotions and behaviors
throughout a data set. Due to the flexibility of this analysis method, the users are not bound
to using only one paradigmatic perspective but within different data sets can use different ones
(Braun & Clarke, 2006).
As thematic analysis is a widely used qualitative analysis technique, several commercial tools
are available, such as Atlas.ti1 and maxQDA2. We also investigated open-source applications
that allows labelling of artifacts such as Label Studio3. Although these tools are very well
developed, there are four major trade offs that inspired the development of LaMa.
• Cost: The services provided by the commercial tools mentioned above are not free and
can be quite expensive depending on the subscription
• Data access and privacy: Qualitative researches often process sensitive data, such as
legally protected information, private information of individuals. With rising privacy
concerns, increasing number of research organizations are requiring specialized approval
for working with such data. For example, at Eindhoven University of Technology it is
mandatory, among other information, to specify which individuals can have access to
the research data. With commercial tools, control over the access of the research data
or the storage location are often unavailable.
• Complex collaboration workflow: Collaborative labelling or coding is an established
method for reducing bias during qualitative analysis (Richards & Hemphill, 2017). While
commercial tools provide this feature in various forms, the process for resolving conflicting
labels is often complicated.
• Thematic analysis use-case: We identified several annotation tools, including open-source
ones (i.e., Label Studio4), that can annotate texts, images, audio and various other data
formats. However, these tools are primarily intended to be used together with various
machine learning or classification algorithms and therefore, not particularly tailored
towards thematic analysis related use-cases

Based on these points we developed LaMa, which is a web application intended to support the
thematic analysis and is built based on an existing application called the Labeling Machine
(Muctadir, 2022), which is forked from the earlier Labeling Machine (Aghajani, 2022). In
addition to significantly improving the user interface, LaMa provides additional features such
as multi-labelling, hierarchical theming, and change tracking. Its key features are described in
the following section. -->

<!-- 2 -->
<!-- `Gala` is an Astropy-affiliated Python package for galactic dynamics. Python
enables wrapping low-level languages (e.g., C) for speed without losing
flexibility or ease-of-use in the user-interface. The API for `Gala` was
designed to provide a class-based and user-friendly interface to fast (C or
Cython-optimized) implementations of common operations such as gravitational
potential and force evaluation, orbit integration, dynamical transformations,
and chaos indicators for nonlinear dynamics. `Gala` also relies heavily on and
interfaces well with the implementations of physical units and astronomical
coordinate systems in the `Astropy` package [@astropy] (`astropy.units` and
`astropy.coordinates`).

`Gala` was designed to be used by both astronomical researchers and by
students in courses on gravitational dynamics or astronomy. It has already been
used in a number of scientific publications [@Pearson:2017] and has also been
used in graduate courses on Galactic dynamics to, e.g., provide interactive
visualizations of textbook material [@Binney:2008]. The combination of speed,
design, and support for Astropy functionality in `Gala` will enable exciting
scientific explorations of forthcoming data releases from the *Gaia* mission
[@gaia] by students and experts alike. -->

# Mathematics

Single dollars ($) are required for inline mathematics e.g. $f(x) = e^{\pi/x}$

Double dollars make self-standing equations:

$$\Theta(x) = \left\{\begin{array}{l}
0\textrm{ if } x < 0\cr
1\textrm{ else}
\end{array}\right.$$

You can also use plain \LaTeX for equations
\begin{equation}\label{eq:fourier}
\hat f(\omega) = \int_{-\infty}^{\infty} f(x) e^{i\omega x} dx
\end{equation}
and refer to \autoref{eq:fourier} from text.

# Citations

Citations to entries in paper.bib should be in
[rMarkdown](http://rmarkdown.rstudio.com/authoring_bibliographies_and_citations.html)
format.

If you want to cite a software repository URL (e.g. something on GitHub without a preferred
citation) then you can do it with the example BibTeX entry below for @fidgit.

For a quick reference, the following citation commands can be used:
- `@author:2001`  ->  "Author et al. (2001)"
- `[@author:2001]` -> "(Author et al., 2001)"
- `[@author1:2001; @author2:2001]` -> "(Author1 et al., 2001; Author2 et al., 2002)"

# Figures

Figures can be included like this:
![Caption for example figure.\label{fig:example}](figure.png)
and referenced from text using \autoref{fig:example}.

Figure sizes can be customized by adding an optional second parameter:
![Caption for example figure.](figure.png){ width=20% }

# Acknowledgements

We acknowledge contributions from Brigitta Sipocz, Syrtis Major, and Semyeong
Oh, and support from Kathryn Johnston during the genesis of this project.

# References