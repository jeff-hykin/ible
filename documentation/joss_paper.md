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

There are many cases where users of all skill levels need to efficiently label confidential videos, in a way that can be validated by researchers that do not have programming backgrounds. A sufficient soulution to this problem would meet the following criteria:

- **Private**: A tool that works with private confidential videos. This tool should be capable of being audited, which effectively requires that it be open source.
- **Minimal Investment**: Although difficult to measure, an inexperienced individual should realistically be able to expect to spend 15 minutes or less total in the process of installation, opening a video, recording two observations, and opening the results in their spreadsheet editor of choice.
- **Throughput**: The tool should enable both observations to be recorded faster, and the results to be validated faster than a manual process.
- **Error Prevention**: The tool should be able to prevent the common pitfalls of [ FIXME / TODO ] as outlined in [Priya's paper]
- **Minimum Scalability**: The user interface needs to continue to function normally, even when presented with hundreds of videos.
- **Consistently Accessible**: The tool should be cross-platform and consistent across platforms, with support for the largest three desktop operating systems.
- **Arbitrary Validation Metric**: The validation should allow for any number of users to confirm or reject the labeled observations.
- **Programming API**: There should be a means for a script or program to generate observations and confirmations. This format should be the same interface as download format, which should be the same format as the upload format.
- **Extensible Design**: Finally, the tool should be extensible, also known as forward-compatible, with future variants of the tool. In particular, it should be capable of being extended (rather than rewritten) to handle the following:
    - Synchronization between multiple data sources, such as shared databases.
    - Mass renaming and error correction of labels.
    - Collaboration for small scale teams (a hosted local-access server).
    - Millions of videos and observations without the interface slowing.
    - Distributed labeling (public facing server with data-access controls).


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

# Existing Solutions

While there are many tools available for labeling videos, none meet the criteria above. However, there are categories of tools that miss the critera for different reasons that are worth discussing here.

1. Proprietary online labelling services. This includes such tools as as LabelBox, or Keylabs [TODO: citation needed]. While each of these provide a great deal of features, they also come with several limitations.
- None are an option for studies with confidential videos, such as NIH human subject studies.
- They are unable to label YouTube videos without first (manually) downloading them, and unable to label local videos without first uploading them. This adds a significant amount of time, and often makes them fail to meet the minimum time investment requirement.
- While many of these services are designed around collaboration, they also usually limit the collaboration quanity for the free version of their service. This acts as a barrier for researchers who would like to scale their work over time.
2. In contrast to proprietary solutions, CVAT [TODO: citation] is both open source and self-hostable. Similar to some of the proprietary tools, it also has limitations:
- While the tool is self-hostable, it is not close to meeting the minimum time investment requirement escpecially for researchers that lack a programming background.
- All videos need to be processed after uploading (can take hours for a 1080p 30min video)
- Still unable to load youtube videos without first (manually) downloading them
- Does not have native support for confidence values, individual label verification, or negative labels (there are workarounds some of these, but the workarounds make labelling slower)
- CVAT has many wonderful features: projects, tasks, jobs, tags, labels, objects, masks, points, polylines, etc. However the features are often mandatory and consume the UI interface making simple use cases difficult
- Import format is different from export format (multiple import/export formats)
- No visual of timeline with labels on the timeline
- No interactive explanation of import/export format(s)
3. Manual recording
- Would need to write down video id, timestamps, confidence value, observer, etc manually
- Need to manually coordinate with ~20 people on:
- data format / database
- label names (uppercase/lowercase differences)
- not accidentally using the same username/model name
- Manually analyze/verify labels

# Implementation and Design

Ible ("ible" as in "reproducible") was designed to meet these needs along with many quality of life improvements. In order to be cross platform and later capable of distributed labeling, is designed as a local first web application, distributed as an all-in-one executable. This allows for running the application on a local machine, and simplying using it as an app. However, it also enables sharing the application with a small team on the local network. All videos stored on the host machine, will be accessible to users on the network. Each user is able to locally save and edit their own observations.

The data structure is centered around a table of observations and a table of videos videos. There is a standard pre-defined schema for both videos and observations. However, to be extensible, the tool supports adding arbitrary metadata to both tables.

Data can be both downloaded and uploaded in the same format; a collection of TSV files (tab separated values). Beyond merely uploading new data, the format allows for editing and deleting data. This allows for someone familar with a spreadsheet program to perform bulk edits, and then upload the changes.

Videos need a unique identifier, which is where Ible differs from other tools. Ible, upon request, will automatically generate an ID for each video, and store it as part of the video name on the host machine. This allows for videos to be renamed and moved without loosing the ID and corrupting the data. For public videos, Ible allows loading and using YouTube videos, each of which already has a unique ID.

In order to achive the goal of minimal time investment, Ible, whenever possible, opts for intuitive interface design principles and in-application instructions rather than a tutorial or user manual. In the limited testing that was possible, these changes seemed to significantly improve time required for a new user to complete their first labeling task.

[TODO: image]


# Emperical Evaluation

Ible has been tested in two different scenarios. Ible was recently tested on a small dataset of confidential data as part of a research study at Texas A&M University. The study was designed to study human reactions in disaster response scenarios where a robotic support system is present. The dataset consisted of 30 videos (FIXME: check if more were added since last writing), each with four or more observations. For this study the alternative would be to perform manual labeling, which the researchers claimed would have taken significantly longer than with the use of Ible.

The second scenario involved using a prototype of Ible for data submission and validation for a deep learning course at Texas A&M University. This included thousands of observations, hundreds of videos, submitted by 25 students. The data included both human and machine generated labels ranging from "fire" to "falling down". While recording manually would have been the fallback for this group, without the availablity of Ible, it is likely the project would have been cancelled due impracticalicty of the task.

# Usage

To use an Ible for your own research, you can download the latest release from the [releases page](https://github.com/ible/ible/releases). [FIXME: add the link to the release page]

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