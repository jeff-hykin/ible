•What are you trying to do?
    Articulate your objectives using absolutely no jargon. Elevator pitch.
•How is it done today, and what are the limits of current practice?
•What's new in your approach and what makes it better than other similar work?
•Who cares? What difference will it make-to whom?
•How did you check for success?


It is time consuming and increasingly common for researchers and information workers to need to collaboratively add annotated timestamps to videos. For regular data many proprietary cloud solutions exist. However, for data that cannot leave a local network, spreadsheets are often used to manually track timestamps due to a lack of viable alternatives. Here we present Ible, a tool that has been used at Texas A&M to create tens of thousands of timestamps by over 25 graduate students for both coursework and research projects. Ible is a low-commitment high-throughput tool cross-platform graphical tool for fast timestamp generation, verification, and analysis.

Adding timestamps to videos for research is a common and sometimes time-consuming task. While there are proprietary and self-hosted tools to aid in this task, the time needed for non-technical users to set up and familiarize themselves with these tools often outweighs the benefits. Ible aims to change this by being a low-friction high-throughput timestamping tool. Researchers working on private videos should find Ible particularly useful for saving time and improving accuracy when labeling videos. It should be particularly true for individuals that need quick turnaround, or have limited programming experience. Ible has been used as part of the Texas A&M deep learning course, as well as a research study conducted by Priyankari Perali.
    
> one sentence statement of what it does

This tool is a cross-platform GUI for fast label generation, verification, and analysis of Youtube videos or private .mp4 videos of NIH human participants, exportable to .json and accessible via a python API.

> Also, you know how Priya’s use case as well, so repeat the same explanation as for the previous case.

Does this just mean to include Priya’s use case in the report?

Use cases (I'll put a formal version in the report, but here's short answers)

- Videos can be arbitrarily long (+8 hours of 4K footage), and do not need to be processed/uploaded
- First use case: 8 emotions, ~1200 labels (Note: this data might be lost, I'll have to dig it up from an old laptop)
- Used by ~25 people for video labels ranging from "fire" to "falling down"
- While recording manually would have been the fallback for this group, it is likely the project would have been cancelled due to label verification being difficult to the point of impractical.

Alternative approaches (in general)
1. Use a proprietary online labelling service such as LabelBox, or Keylabs. Downsides:
- Not an option for confidential videos (NIH human subject videos)
- Unable to label youtube videos without first (manually) downloading them
- Usually unable to coordinate with 20 people unless joining the paid-tier of the service
2. CVAT is open source and self-hostable. However it also downsides:
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

